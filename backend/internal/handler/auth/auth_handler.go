package auth

import "github.com/gofiber/fiber/v2"

type AuthHandler interface {
	Register(context *fiber.Ctx) error
	Login(context *fiber.Ctx) error
	RefreshToken(context *fiber.Ctx) error
	Logout(context *fiber.Ctx) error
	ChangePassword(context *fiber.Ctx) error
}
