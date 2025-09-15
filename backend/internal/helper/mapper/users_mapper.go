package mapper

import (
	"erpfinance/internal/helper"
	"erpfinance/internal/model/domain"
	"erpfinance/internal/model/dto/users"
)

func ToUsersResponse(u domain.Users) *users.UsersResponse {
	return &users.UsersResponse{
		ID:        u.ID,
		Name:      u.Name,
		Email:     u.Email,
		Role:      u.Role,
		CreatedAt: helper.FormatTimeIndonesia(u.CreatedAt),
		UpdatedAt: helper.FormatTimeIndonesia(u.UpdatedAt),
	}
}
func ToUsersResponses(u []domain.Users) []users.UsersResponse {
	var usersResponses []users.UsersResponse
	for _, user := range u {
		usersResponses = append(usersResponses, *ToUsersResponse(user))
	}
	return usersResponses
}
