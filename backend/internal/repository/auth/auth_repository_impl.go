package auth

import (
	"context"
	"erpfinance/internal/model/domain"

	"github.com/google/uuid"
	"gorm.io/gorm"
)

type AuthRepositoryImpl struct {
}

func NewAuthRepository() AuthRepository {
	return &AuthRepositoryImpl{}
}

func (repository *AuthRepositoryImpl) Create(ctx context.Context, tx *gorm.DB, users domain.Users) (domain.Users, error) {
	err := tx.WithContext(ctx).Create(&users).Error
	if err != nil {
		return domain.Users{}, err
	}
	return users, nil
}

func (repository *AuthRepositoryImpl) FindByEmail(ctx context.Context, tx *gorm.DB, email string) (domain.Users, error) {
	var users domain.Users

	err := tx.WithContext(ctx).Where("email = ?", email).First(&users).Error
	if err != nil {
		return domain.Users{}, err
	}
	return users, nil
}

func (repository *AuthRepositoryImpl) FindById(ctx context.Context, tx *gorm.DB, id uuid.UUID) (domain.Users, error) {
	var users domain.Users

	err := tx.WithContext(ctx).Where("id = ?", id).First(&users).Error
	if err != nil {
		return domain.Users{}, err
	}
	return users, nil
}

func (repository *AuthRepositoryImpl) Update(ctx context.Context, tx *gorm.DB, users domain.Users) error {
	err := tx.WithContext(ctx).Model(&users).Updates(users).Error
	if err != nil {
		return err
	}
	return nil
}

func (repository *AuthRepositoryImpl) Delete(ctx context.Context, tx *gorm.DB, id uuid.UUID) error {
	err := tx.WithContext(ctx).Where("id = ?", id).Delete(&domain.Users{}).Error
	if err != nil {
		return err
	}
	return nil
}
