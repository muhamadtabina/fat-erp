//go:build wireinject
// +build wireinject

package config

import (
	"erpfinance/internal/handler/auth"
	"erpfinance/internal/handler/users"
	authRepo "erpfinance/internal/repository/auth"
	tokenRepo "erpfinance/internal/repository/token"
	usersRepo "erpfinance/internal/repository/users"
	authService "erpfinance/internal/service/auth"
	usersService "erpfinance/internal/service/users"

	"github.com/go-playground/validator/v10"
	"github.com/google/wire"
	"gorm.io/gorm"
)

// ProviderSet adalah kumpulan provider untuk dependency injection
var ProviderSet = wire.NewSet(
	// Repository providers
	authRepo.NewAuthRepository,
	tokenRepo.NewTokenRepository,
	usersRepo.NewUsersRepository,

	// Service providers
	authService.NewAuthService,
	usersService.NewUsersService,

	// Handler providers
	auth.NewAuthHandler,
	users.NewUsersHandler,

	// Validator provider
	ProvideValidator,
)

// ProvideValidator menyediakan instance validator
func ProvideValidator() *validator.Validate {
	return validator.New()
}

// InitializeAuthHandler menginisialisasi auth handler dengan semua dependensinya
func InitializeAuthHandler(db *gorm.DB) (auth.AuthHandler, error) {
	wire.Build(ProviderSet)
	return &auth.AuthHandlerImpl{}, nil
}

// InitializeUsersHandler menginisialisasi users handler dengan semua dependensinya
func InitializeUsersHandler(db *gorm.DB) (users.UsersHandler, error) {
	wire.Build(ProviderSet)
	return &users.UsersHandlerImpl{}, nil
}
