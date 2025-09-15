package token

import (
	"context"
	"erpfinance/internal/model/domain"
	"time"

	"github.com/google/uuid"
	"gorm.io/gorm"
)

type TokenRepositoryImpl struct{}

func NewTokenRepository() TokenRepository {
	return &TokenRepositoryImpl{}
}

func (repository *TokenRepositoryImpl) Create(ctx context.Context, tx *gorm.DB, userID uuid.UUID, token string) error {
	refreshToken := domain.RefreshToken{
		ID:        uuid.New(),
		UserID:    userID,
		Token:     token,
		ExpiresAt: time.Now().Add(7 * 24 * time.Hour), // 7 hari
	}

	err := tx.WithContext(ctx).Create(&refreshToken).Error
	if err != nil {
		return err
	}
	return nil
}

func (repository *TokenRepositoryImpl) FindByToken(ctx context.Context, tx *gorm.DB, token string) (domain.RefreshToken, error) {
	var refreshToken domain.RefreshToken

	err := tx.WithContext(ctx).Where("token = ? AND expires_at > ?", token, time.Now()).First(&refreshToken).Error
	if err != nil {
		return domain.RefreshToken{}, err
	}
	return refreshToken, nil
}

func (repository *TokenRepositoryImpl) Delete(ctx context.Context, tx *gorm.DB, tokenID uuid.UUID) error {
	err := tx.WithContext(ctx).Where("id = ?", tokenID).Delete(&domain.RefreshToken{}).Error
	if err != nil {
		return err
	}
	return nil
}

func (repository *TokenRepositoryImpl) DeleteByUserID(ctx context.Context, tx *gorm.DB, userID uuid.UUID) error {
	err := tx.WithContext(ctx).Where("user_id = ?", userID).Delete(&domain.RefreshToken{}).Error
	if err != nil {
		return err
	}
	return nil
}

func (repository *TokenRepositoryImpl) DeleteExpired(ctx context.Context, tx *gorm.DB) error {
	err := tx.WithContext(ctx).Where("expires_at <= ?", time.Now()).Delete(&domain.RefreshToken{}).Error
	if err != nil {
		return err
	}
	return nil
}

func (repository *TokenRepositoryImpl) FindByUserID(ctx context.Context, tx *gorm.DB, userID uuid.UUID) ([]domain.RefreshToken, error) {
	var refreshTokens []domain.RefreshToken

	err := tx.WithContext(ctx).Where("user_id = ? AND expires_at > ?", userID, time.Now()).Find(&refreshTokens).Error
	if err != nil {
		return nil, err
	}
	return refreshTokens, nil
}