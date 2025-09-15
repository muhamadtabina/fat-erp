package routes

import (
	"erpfinance/internal/handler/users"
	"erpfinance/internal/middleware"

	"github.com/gofiber/fiber/v2"
)

func UsersRouter(router *fiber.App, usersHandler users.UsersHandler) {
	app := router.Group("/api/v1/users")

	app.Get("/", middleware.AuthMiddleware(), middleware.IsAdmin(), usersHandler.FindAll)
	app.Get("/:id", middleware.AuthMiddleware(), middleware.IsAdmin(), usersHandler.FindById)
	app.Put("/:id", middleware.AuthMiddleware(), middleware.IsAdmin(), usersHandler.Update)
	app.Delete("/:id", middleware.AuthMiddleware(), middleware.IsAdmin(), usersHandler.Delete)

}
