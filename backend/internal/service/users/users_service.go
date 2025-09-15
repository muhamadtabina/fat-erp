package users

import (
	"context"
	"erpfinance/internal/model/dto"
	"erpfinance/internal/model/dto/users"

	"github.com/google/uuid"
)

type UsersService interface {
	FindAllWithPagination(ctx context.Context, pagination dto.PaginationRequest) (dto.PaginationResponse, error)
	FindById(ctx context.Context, id uuid.UUID) (*users.UsersResponse, error)
	Update(ctx context.Context, id uuid.UUID, request users.UsersUpdateRequest) error
	Delete(ctx context.Context, id uuid.UUID) error
}
