package users

import (
	"erpfinance/internal/model/domain"
)

type UsersUpdateRequest struct {
	Name  string      `json:"name" validate:"required"`
	Email string      `json:"email" validate:"required,email"`
	Role  domain.Role `json:"role" validate:"oneof='Admin' 'PPC' 'Purchasing' 'Warehouse' 'Logistics'"`
}
