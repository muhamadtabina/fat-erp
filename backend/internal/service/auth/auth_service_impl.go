package auth

import (
	"context"
	"erpfinance/internal/helper"
	"erpfinance/internal/helper/mapper"
	"erpfinance/internal/model/domain"
	"erpfinance/internal/model/dto/auth"
	repo "erpfinance/internal/repository/auth"
	tokenRepo "erpfinance/internal/repository/token"
	"errors"
	"log"

	"github.com/go-playground/validator/v10"
	"github.com/google/uuid"
	"gorm.io/gorm"
)

type AuthServiceImpl struct {
	AuthRepository  repo.AuthRepository
	TokenRepository tokenRepo.TokenRepository
	DB              *gorm.DB
	Validate        *validator.Validate
}

func NewAuthService(authRepository repo.AuthRepository, tokenRepository tokenRepo.TokenRepository, db *gorm.DB, validate *validator.Validate) AuthService {
	return &AuthServiceImpl{
		AuthRepository:  authRepository,
		TokenRepository: tokenRepository,
		DB:              db,
		Validate:        validate,
	}
}

func (service *AuthServiceImpl) Register(ctx context.Context, request auth.AuthRegisterRequest) (*auth.AuthResponse, error) {
	if err := service.Validate.Struct(request); err != nil {
		return nil, helper.FormatValidationError(err)
	}

	var createdUser domain.Users

	err := service.DB.WithContext(ctx).Transaction(func(tx *gorm.DB) error {
		existingEmail, err := service.AuthRepository.FindByEmail(ctx, tx, request.Email)
		if err == nil && existingEmail.ID != uuid.Nil {
			return errors.New("email already exists")
		}

		hashedPassword, err := helper.HashPassword(request.Password)
		if err != nil {
			return err
		}

		users := domain.Users{
			ID:       uuid.New(),
			Name:     request.Name,
			Email:    request.Email,
			Password: hashedPassword,
			Role:     request.Role,
		}

		createdUser, err = service.AuthRepository.Create(ctx, tx, users)
		if err != nil {
			return err
		}
		return nil
	})
	if err != nil {
		return nil, err
	}

	return mapper.ToAuthResponse(createdUser), nil
}

func (service *AuthServiceImpl) Login(ctx context.Context, request auth.AuthLoginRequest) (*auth.TokenResponse, error) {
	if err := service.Validate.Struct(request); err != nil {
		return nil, helper.FormatValidationError(err)
	}

	var result auth.TokenResponse

	err := service.DB.WithContext(ctx).Transaction(func(tx *gorm.DB) error {
		// Find user by email
		user, err := service.AuthRepository.FindByEmail(ctx, tx, request.Email)
		if err != nil {
			return errors.New("invalid email or password")
		}

		// Check password
		if !helper.CheckPasswordHash(request.Password, user.Password) {
			return errors.New("invalid email or password")
		}

		// Generate JWT tokens
		accessToken, refreshToken, err := helper.GenerateJWT(user)
		if err != nil {
			return err
		}

		// Simpan refresh token baru ke database untuk sesi yang aman
		if err := service.TokenRepository.Create(ctx, tx, user.ID, refreshToken); err != nil {
			return errors.New("failed to create user session")
		}

		result = auth.TokenResponse{
			AccessToken:  accessToken,
			RefreshToken: refreshToken,
			User: &auth.UserResponse{
				ID:    user.ID,
				Name:  user.Name,
				Email: user.Email,
			},
		}

		return nil
	})

	if err != nil {
		return nil, err
	}

	return &result, nil
}

func (service *AuthServiceImpl) RefreshToken(ctx context.Context, request auth.RefreshTokenRequest) (*auth.TokenResponse, error) {
	if err := service.Validate.Struct(request); err != nil {
		return nil, helper.FormatValidationError(err)
	}

	var result auth.TokenResponse

	// 1. Validasi format refresh token
	claims, err := helper.ValidateToken(request.RefreshToken, true)
	if err != nil {
		return nil, errors.New("invalid or expired refresh token")
	}

	err = service.DB.WithContext(ctx).Transaction(func(tx *gorm.DB) error {
		// 2. Cari refresh token di database untuk memastikan token itu valid dan belum digunakan
		storedToken, err := service.TokenRepository.FindByToken(ctx, tx, request.RefreshToken)
		if err != nil {
			// Jika token tidak ada di DB, berarti token sudah tidak valid (mungkin sudah digunakan atau dicuri)
			return errors.New("refresh token not found or has been invalidated")
		}

		// 3. Dapatkan data user
		user, err := service.AuthRepository.FindById(ctx, tx, claims.ID)
		if err != nil {
			return errors.New("user not found")
		}

		// 4. HAPUS refresh token lama dari database. Ini adalah langkah kuncinya (ROTATION).
		if err := service.TokenRepository.Delete(ctx, tx, storedToken.ID); err != nil {
			return errors.New("failed to invalidate old token")
		}

		// 5. Buat access token dan refresh token baru
		accessToken, refreshToken, err := helper.GenerateJWT(user)
		if err != nil {
			return err
		}

		// 6. SIMPAN refresh token baru ke database
		err = service.TokenRepository.Create(ctx, tx, user.ID, refreshToken)
		if err != nil {
			return errors.New("failed to save new refresh token")
		}

		result = auth.TokenResponse{
			AccessToken:  accessToken,
			RefreshToken: refreshToken,
			// Menambahkan data user untuk frontend
			User: &auth.UserResponse{
				ID:    user.ID,
				Name:  user.Name,
				Email: user.Email,
			},
		}

		return nil
	})

	if err != nil {
		return nil, err
	}

	return &result, nil
}

func (service *AuthServiceImpl) Logout(ctx context.Context, request auth.LogoutRequest) error {
	if err := service.Validate.Struct(request); err != nil {
		return helper.FormatValidationError(err)
	}

	// Validasi access token
	claims, err := helper.ValidateToken(request.Token, false)
	if err != nil {
		return errors.New("invalid access token")
	}

	err = service.DB.WithContext(ctx).Transaction(func(tx *gorm.DB) error {
		// Hapus semua refresh token untuk user ini
		err = service.TokenRepository.DeleteByUserID(ctx, tx, claims.ID)
		if err != nil {
			return errors.New("failed to logout")
		}
		return nil
	})

	if err != nil {
		return err
	}

	return nil
}

func (service *AuthServiceImpl) ChangePassword(ctx context.Context, userID uuid.UUID, request auth.ChangePasswordRequest) error {
    if err := service.Validate.Struct(request); err != nil {
        return helper.FormatValidationError(err)
    }

    err := service.DB.WithContext(ctx).Transaction(func(tx *gorm.DB) error {
        // Find user by ID
        user, err := service.AuthRepository.FindById(ctx, tx, userID)
        if err != nil {
            return errors.New("user not found")
        }

        // Verify old password
        if !helper.CheckPasswordHash(request.OldPassword, user.Password) {
            return errors.New("incorrect old password")
        }

        // Check that new password is not same as old
        if helper.CheckPasswordHash(request.NewPassword, user.Password) {
            return errors.New("new password must be different from old password")
        }

        // <-- Pengecekan konfirmasi password dihapus.
        // Percayakan pada validator di lapisan sebelumnya.

        // Hash new password
        hashedPassword, err := helper.HashPassword(request.NewPassword)
        if err != nil {
            return errors.New("failed to encrypt password")
        }

        // Update user password
        user.Password = hashedPassword
        if err = service.AuthRepository.Update(ctx, tx, user); err != nil {
            return errors.New("failed to update password")
        }

        // <-- PENTING: Hapus semua sesi/refresh token lama saat ganti password.
        // Ini memaksa logout di semua perangkat lain untuk keamanan.
        if err := service.TokenRepository.DeleteByUserID(ctx, tx, user.ID); err != nil {
            // Kita bisa log error ini, tapi jangan sampai membuat proses ganti password gagal.
            // Paling penting password sudah berhasil diubah.
            log.Printf("warning: failed to delete old sessions for user %s: %v", user.ID, err)
        }

        return nil
    })

    return err
}
