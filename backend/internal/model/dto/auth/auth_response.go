package auth

import (
	"erpfinance/internal/model/domain"

	"github.com/google/uuid"
)

type AuthResponse struct {
	ID        uuid.UUID   `json:"id"`
	Email     string      `json:"email"`
	Name      string      `json:"name"`
	Role      domain.Role `json:"role"`
	CreatedAt string      `json:"created_at"`
	UpdatedAt string      `json:"updated_at"`
}
