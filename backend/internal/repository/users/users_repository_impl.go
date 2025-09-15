package users

import (
	"context"
	"erpfinance/internal/model/domain"

	"github.com/google/uuid"
	"gorm.io/gorm"
)

type UsersRepositoryImpl struct {
}

func NewUsersRepository() UsersRepository {
	return &UsersRepositoryImpl{}
}

func (repository *UsersRepositoryImpl) FindAllWithPagination(ctx context.Context, tx *gorm.DB, page, limit int) ([]domain.Users, int64, error) {
	var users []domain.Users
	var totalItems int64

	// Hitung total items
	err := tx.WithContext(ctx).Model(&domain.Users{}).Count(&totalItems).Error
	if err != nil {
		return nil, 0, err
	}

	// Ambil data dengan pagination
	offset := (page - 1) * limit
	err = tx.WithContext(ctx).
		Offset(offset).Limit(limit).
		Find(&users).Error
	if err != nil {
		return nil, 0, err
	}

	return users, totalItems, nil
}

func (repository *UsersRepositoryImpl) FindById(ctx context.Context, tx *gorm.DB, id uuid.UUID) (domain.Users, error) {
	var users domain.Users

	err := tx.WithContext(ctx).Where("id = ?", id).First(&users).Error
	if err != nil {
		return domain.Users{}, err
	}
	return users, nil
}

func (repository *UsersRepositoryImpl) Update(ctx context.Context, tx *gorm.DB, users domain.Users) error {
	err := tx.WithContext(ctx).Model(&users).Updates(users).Error
	if err != nil {
		return err
	}
	return nil
}

func (repository *UsersRepositoryImpl) Delete(ctx context.Context, tx *gorm.DB, id uuid.UUID) error {
	err := tx.WithContext(ctx).Where("id = ?", id).Delete(&domain.Users{}).Error
	if err != nil {
		return err
	}
	return nil
}

func (repository *UsersRepositoryImpl) FindByEmail(ctx context.Context, tx *gorm.DB, email string) (domain.Users, error) {
	var users domain.Users

	err := tx.WithContext(ctx).Where("email = ?", email).First(&users).Error
	if err != nil {
		return domain.Users{}, err
	}
	return users, nil
}

func (repository *UsersRepositoryImpl) FindByEmailAndNotID(ctx context.Context, tx *gorm.DB, email string, id uuid.UUID) (domain.Users, error) {
	var users domain.Users

	err := tx.WithContext(ctx).Where("email = ? AND id != ?", email, id).First(&users).Error
	if err != nil {
		return domain.Users{}, err
	}
	return users, nil
}
