package auth

import (
	"context"
	"erpfinance/internal/model/domain"

	"github.com/google/uuid"
	"gorm.io/gorm"
)

type AuthRepository interface {
	Create(ctx context.Context, tx *gorm.DB, users domain.Users) (domain.Users, error)
	FindByEmail(ctx context.Context, tx *gorm.DB, email string) (domain.Users, error)
	FindById(ctx context.Context, tx *gorm.DB, id uuid.UUID) (domain.Users, error)
	Update(ctx context.Context, tx *gorm.DB, users domain.Users) error
}
