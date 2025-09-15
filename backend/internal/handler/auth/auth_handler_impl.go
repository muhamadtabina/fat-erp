package auth

import (
	"erpfinance/internal/model/dto"
	"erpfinance/internal/model/dto/auth"
	service "erpfinance/internal/service/auth"

	"github.com/gofiber/fiber/v2"
	"github.com/google/uuid"
)

type AuthHandlerImpl struct {
	AuthService service.AuthService
}

func NewAuthHandler(authService service.AuthService) AuthHandler {
	return &AuthHandlerImpl{
		AuthService: authService,
	}
}

// Register godoc
// @Summary Register a new user
// @Description Register a new user with email and password
// @Tags auth
// @Accept json
// @Produce json
// @Param request body auth.AuthRegisterRequest true "Register request"
// @Success 201 {object} dto.WebResponse
// @Failure 400 {object} dto.WebResponse
// @Router /api/auth/register [post]
func (handler *AuthHandlerImpl) Register(context *fiber.Ctx) error {
	var request auth.AuthRegisterRequest
	if err := context.BodyParser(&request); err != nil {
		return context.Status(fiber.StatusBadRequest).JSON(dto.WebResponse{
			Code:    fiber.StatusBadRequest,
			Status:  "BAD REQUEST",
			Message: "Invalid request format",
		})
	}

	_, err := handler.AuthService.Register(context.Context(), request)
	if err != nil {
		return context.Status(fiber.StatusBadRequest).JSON(dto.WebResponse{
			Code:    fiber.StatusBadRequest,
			Status:  "BAD REQUEST",
			Message: err.Error(),
		})
	}

	return context.Status(fiber.StatusCreated).JSON(dto.WebResponse{
		Code:    fiber.StatusCreated,
		Status:  "CREATED",
		Message: "Registration successful",
	})
}

// Login godoc
// @Summary Login user
// @Description Login user with email and password
// @Tags auth
// @Accept json
// @Produce json
// @Param request body auth.AuthLoginRequest true "Login request"
// @Success 200 {object} dto.WebResponse
// @Failure 400 {object} dto.WebResponse
// @Router /api/auth/login [post]
func (handler *AuthHandlerImpl) Login(context *fiber.Ctx) error {
	var request auth.AuthLoginRequest
	if err := context.BodyParser(&request); err != nil {
		return context.Status(fiber.StatusBadRequest).JSON(dto.WebResponse{
			Code:    fiber.StatusBadRequest,
			Status:  "BAD REQUEST",
			Data:    err.Error(),
			Message: "Failed to read login request",
		})
	}

	response, err := handler.AuthService.Login(context.Context(), request)
	if err != nil {
		return context.Status(fiber.StatusBadRequest).JSON(dto.WebResponse{
			Code:    fiber.StatusBadRequest,
			Status:  "BAD REQUEST",
			Data:    err.Error(),
			Message: "Login failed. Please check your email and password.",
		})
	}

	// Set refresh token in HTTP-only cookie with security flags
	context.Cookie(&fiber.Cookie{
		Name:     "refresh_token",
		Value:    response.RefreshToken,
		MaxAge:   7 * 24 * 60 * 60, // 7 hari
		Path:     "/",
		Domain:   "localhost", // ganti sesuai domain
		Secure:   false,       // true jika HTTPS
		HTTPOnly: true,
		SameSite: "Strict",    // CSRF protection
	})

	// Beri pesan sukses
	return context.Status(fiber.StatusOK).JSON(dto.WebResponse{
		Code:    fiber.StatusOK,
		Status:  "OK",
		Message: "Login successful",
		Data: fiber.Map{
			"access_token":  response.AccessToken,
		},
	})
}

// RefreshToken godoc
// @Summary Refresh access token
// @Description Refresh access token using refresh token from cookie or request body
// @Tags auth
// @Accept json
// @Produce json
// @Param request body auth.RefreshTokenRequest false "Refresh token request (optional if using cookie)"
// @Success 200 {object} dto.WebResponse
// @Failure 400 {object} dto.WebResponse
// @Failure 401 {object} dto.WebResponse
// @Router /api/auth/refresh [post]
func (handler *AuthHandlerImpl) RefreshToken(context *fiber.Ctx) error {
	// Coba ambil refresh token dari cookie terlebih dahulu
	refreshToken := context.Cookies("refresh_token")

	// Jika tidak ada di cookie, coba ambil dari body request
	if refreshToken == "" {
		var request auth.RefreshTokenRequest
		if err := context.BodyParser(&request); err != nil {
			return context.Status(fiber.StatusBadRequest).JSON(dto.WebResponse{
				Code:    fiber.StatusBadRequest,
				Status:  "BAD REQUEST",
				Message: "Invalid request format",
			})
		}

		// Gunakan refresh token dari body request
		refreshToken = request.RefreshToken
	}

	// Jika masih kosong, berarti tidak ada refresh token
	if refreshToken == "" {
		return context.Status(fiber.StatusUnauthorized).JSON(dto.WebResponse{
			Code:    fiber.StatusUnauthorized,
			Status:  "UNAUTHORIZED",
			Message: "Refresh token not found in cookie or request body",
		})
	}

	response, err := handler.AuthService.RefreshToken(context.Context(), auth.RefreshTokenRequest{
		RefreshToken: refreshToken,
	})
	if err != nil {
		return context.Status(fiber.StatusUnauthorized).JSON(dto.WebResponse{
			Code:    fiber.StatusUnauthorized,
			Status:  "UNAUTHORIZED",
			Message: "Invalid or expired refresh token",
		})
	}

	// Update refresh token cookie with security flags
	context.Cookie(&fiber.Cookie{
		Name:     "refresh_token",
		Value:    response.RefreshToken,
		MaxAge:   7 * 24 * 60 * 60,
		Path:     "/",
		Domain:   "localhost",
		Secure:   false,
		HTTPOnly: true,
		SameSite: "Strict",
	})

	return context.Status(fiber.StatusOK).JSON(dto.WebResponse{
		Code:    fiber.StatusOK,
		Status:  "OK",
		Message: "Token successfully refreshed",
		Data: fiber.Map{
			"access_token":  response.AccessToken,
			"refresh_token": response.RefreshToken, // Menambahkan refresh token ke response untuk aplikasi mobile
		},
	})
}

// Logout godoc
// @Summary Logout user
// @Description Logout user and invalidate token
// @Tags auth
// @Accept json
// @Produce json
// @Param Authorization header string true "Bearer token"
// @Success 200 {object} dto.WebResponse
// @Failure 401 {object} dto.WebResponse
// @Router /api/auth/logout [post]
func (handler *AuthHandlerImpl) Logout(context *fiber.Ctx) error {
	// Ambil token dari header Authorization
	token := context.Get("Authorization")
	if token == "" {
		return context.Status(fiber.StatusUnauthorized).JSON(dto.WebResponse{
			Code:    fiber.StatusUnauthorized,
			Status:  "UNAUTHORIZED",
			Message: "Token not found",
		})
	}

	// Remove "Bearer " prefix
	if len(token) > 7 {
		token = token[7:]
	}

	// Call logout service
	err := handler.AuthService.Logout(context.Context(), auth.LogoutRequest{
		Token: token,
	})
	if err != nil {
		return context.Status(fiber.StatusUnauthorized).JSON(dto.WebResponse{
			Code:    fiber.StatusUnauthorized,
			Status:  "UNAUTHORIZED",
			Message: "Logout failed. Invalid token.",
		})
	}

	// Hapus refresh token cookie with security flags
	context.Cookie(&fiber.Cookie{
		Name:     "refresh_token",
		Value:    "",
		MaxAge:   -1,
		Path:     "/",
		Domain:   "localhost",
		Secure:   false,
		HTTPOnly: true,
		SameSite: "Strict", // CSRF protection
	})

	return context.Status(fiber.StatusOK).JSON(dto.WebResponse{
		Code:    fiber.StatusOK,
		Status:  "OK",
		Message: "Logout successful",
	})
}

// ChangePassword godoc
// @Summary Change user password
// @Description Change user password with current and new password
// @Tags auth
// @Accept json
// @Produce json
// @Param Authorization header string true "Bearer token"
// @Param request body auth.ChangePasswordRequest true "Change password request"
// @Success 200 {object} dto.WebResponse
// @Failure 400 {object} dto.WebResponse
// @Failure 401 {object} dto.WebResponse
// @Router /api/auth/change-password [post]
func (handler *AuthHandlerImpl) ChangePassword(context *fiber.Ctx) error {
	var request auth.ChangePasswordRequest
	if err := context.BodyParser(&request); err != nil {
		return context.Status(fiber.StatusBadRequest).JSON(dto.WebResponse{
			Code:    fiber.StatusBadRequest,
			Status:  "BAD REQUEST",
			Message: "Failed to read password change request",
			Data:    err.Error(),
		})
	}

	// Get user ID from token verified by auth middleware
	userID := context.Locals("userID").(uuid.UUID)
	if userID == uuid.Nil {
		return context.Status(fiber.StatusUnauthorized).JSON(dto.WebResponse{
			Code:    fiber.StatusUnauthorized,
			Status:  "UNAUTHORIZED",
			Message: "Please login first",
		})
	}

	// Call change password service
	err := handler.AuthService.ChangePassword(context.Context(), userID, request)
	if err != nil {
		return context.Status(fiber.StatusBadRequest).JSON(dto.WebResponse{
			Code:    fiber.StatusBadRequest,
			Status:  "BAD REQUEST",
			Message: "Failed to change password. " + err.Error(),
		})
	}

	return context.Status(fiber.StatusOK).JSON(dto.WebResponse{
		Code:    fiber.StatusOK,
		Status:  "OK",
		Message: "Password successfully changed",
	})
}
