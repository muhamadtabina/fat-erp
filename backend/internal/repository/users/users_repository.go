package users

import (
	"context"
	"erpfinance/internal/model/domain"

	"github.com/google/uuid"
	"gorm.io/gorm"
)

type UsersRepository interface {
	FindAllWithPagination(ctx context.Context, tx *gorm.DB, page, limit int) ([]domain.Users, int64, error)
	FindById(ctx context.Context, tx *gorm.DB, id uuid.UUID) (domain.Users, error)
	Update(ctx context.Context, tx *gorm.DB, users domain.Users) error
	Delete(ctx context.Context, tx *gorm.DB, id uuid.UUID) error
	FindByEmail(ctx context.Context, tx *gorm.DB, email string) (domain.Users, error)
	FindByEmailAndNotID(ctx context.Context, tx *gorm.DB, email string, id uuid.UUID) (domain.Users, error)
}
