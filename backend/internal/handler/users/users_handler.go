package users

import "github.com/gofiber/fiber/v2"

type UsersHandler interface {
	FindAll(ctx *fiber.Ctx) error
	FindById(ctx *fiber.Ctx) error
	Update(ctx *fiber.Ctx) error
	Delete(ctx *fiber.Ctx) error
}
