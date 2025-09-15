package auth

import (
	"context"
	"erpfinance/internal/model/dto/auth"

	"github.com/google/uuid"
)

type AuthService interface {
	Register(ctx context.Context, request auth.AuthRegisterRequest) (*auth.AuthResponse, error)
	Login(ctx context.Context, request auth.AuthLoginRequest) (*auth.TokenResponse, error)
	RefreshToken(ctx context.Context, request auth.RefreshTokenRequest) (*auth.TokenResponse, error)
	Logout(ctx context.Context, request auth.LogoutRequest) error
	ChangePassword(ctx context.Context, userID uuid.UUID, request auth.ChangePasswordRequest) error
}
