package mapper

import (
	"erpfinance/internal/helper"
	"erpfinance/internal/model/domain"
	"erpfinance/internal/model/dto/auth"
)

func ToAuthResponse(user domain.Users) *auth.AuthResponse {
	return &auth.AuthResponse{
		ID:        user.ID,
		Name:      user.Name,
		Email:     user.Email,
		Role:      user.Role,
		CreatedAt: helper.FormatTimeIndonesia(user.CreatedAt),
		UpdatedAt: helper.FormatTimeIndonesia(user.UpdatedAt),
	}
}
