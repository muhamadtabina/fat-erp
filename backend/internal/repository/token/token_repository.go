package token

import (
	"context"
	"erpfinance/internal/model/domain"

	"github.com/google/uuid"
	"gorm.io/gorm"
)

type TokenRepository interface {
	// Create menyimpan refresh token baru ke database
	Create(ctx context.Context, tx *gorm.DB, userID uuid.UUID, token string) error
	
	// FindByToken mencari refresh token berdasarkan token string
	FindByToken(ctx context.Context, tx *gorm.DB, token string) (domain.RefreshToken, error)
	
	// Delete menghapus refresh token berdasarkan ID
	Delete(ctx context.Context, tx *gorm.DB, tokenID uuid.UUID) error
	
	// DeleteByUserID menghapus semua refresh token milik user tertentu
	DeleteByUserID(ctx context.Context, tx *gorm.DB, userID uuid.UUID) error
	
	// DeleteExpired menghapus semua refresh token yang sudah expired
	DeleteExpired(ctx context.Context, tx *gorm.DB) error
	
	// FindByUserID mencari semua refresh token milik user tertentu
	FindByUserID(ctx context.Context, tx *gorm.DB, userID uuid.UUID) ([]domain.RefreshToken, error)
}