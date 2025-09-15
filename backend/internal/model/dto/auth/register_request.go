package auth

import (
	"erpfinance/internal/model/domain"
)

type AuthRegisterRequest struct {
	Name     string      `json:"name" validate:"required,min=2,max=50"`
	Email    string      `json:"email" validate:"required,email"`
	Password string      `json:"password" validate:"required,min=8,max=20"`
	Role     domain.Role `json:"role" validate:"required,oneof='Admin' 'Purchasing' 'PPC' 'Logistics' 'Warehouse'"`
}
