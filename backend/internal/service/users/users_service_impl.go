package users

import (
	"context"
	"erpfinance/internal/exception"
	"erpfinance/internal/helper"
	"erpfinance/internal/helper/mapper"
	"erpfinance/internal/model/dto"
	"erpfinance/internal/model/dto/users"
	repo "erpfinance/internal/repository/users"

	"github.com/go-playground/validator/v10"
	"github.com/google/uuid"
	"gorm.io/gorm"
)

type UsersServiceImpl struct {
	UsersRepository repo.UsersRepository
	DB              *gorm.DB
	Validate        *validator.Validate
}

func NewUsersService(usersRepository repo.UsersRepository, db *gorm.DB, validate *validator.Validate) UsersService {
	return &UsersServiceImpl{
		UsersRepository: usersRepository,
		DB:              db,
		Validate:        validate,
	}
}

func (service *UsersServiceImpl) FindAllWithPagination(ctx context.Context, pagination dto.PaginationRequest) (dto.PaginationResponse, error) {
	// Set default values jika tidak ada
	if pagination.Page <= 0 {
		pagination.Page = 1
	}
	if pagination.Limit <= 0 {
		pagination.Limit = 20 // Default limit 20
	}

	// Panggil repository dengan pagination
	users, totalItems, err := service.UsersRepository.FindAllWithPagination(ctx, service.DB, pagination.Page, pagination.Limit)
	if err != nil {
		return dto.PaginationResponse{}, exception.NewError("users not found")
	}

	// Convert ke response
	responses := mapper.ToUsersResponses(users)

	// Buat pagination response
	paginationResponse := dto.NewPaginationResponse(pagination.Page, pagination.Limit, totalItems, responses)

	return paginationResponse, nil
}

func (service *UsersServiceImpl) FindById(ctx context.Context, id uuid.UUID) (*users.UsersResponse, error) {

	user, err := service.UsersRepository.FindById(ctx, service.DB, id)
	if err != nil {
		return nil, exception.NewError("user not found")
	}

	return mapper.ToUsersResponse(user), nil
}

func (service *UsersServiceImpl) Update(ctx context.Context, id uuid.UUID, request users.UsersUpdateRequest) error {
    if err := service.Validate.Struct(request); err != nil {
        return helper.FormatValidationError(err)
    }

    err := service.DB.WithContext(ctx).Transaction(func(tx *gorm.DB) error {
        user, err := service.UsersRepository.FindById(ctx, tx, id)
        if err != nil {
            return exception.NewError("user not found")
        }

        if user.Email != request.Email {
            existingUser, err := service.UsersRepository.FindByEmail(ctx, tx, request.Email)
            if err == nil && existingUser.ID != id {
                return exception.NewError("email already exists")
            }
        }

        // 3. Update data user
        user.Name = request.Name
        user.Email = request.Email
        user.Role = request.Role

        if err := service.UsersRepository.Update(ctx, tx, user); err != nil {
            return err 
        }

        return nil
    })
    
    return err
}

func (service *UsersServiceImpl) Delete(ctx context.Context, id uuid.UUID) error {
    err := service.DB.WithContext(ctx).Transaction(func(tx *gorm.DB) error {
        user, err := service.UsersRepository.FindById(ctx, tx, id)
        if err != nil {
            return exception.NewError("user not found")
        }

        if err := service.UsersRepository.Delete(ctx, tx, user.ID); err != nil {
            return err 
        }

        return nil
    })

    return err
}
