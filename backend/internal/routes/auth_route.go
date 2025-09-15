package routes

import (
	"erpfinance/internal/handler/auth"
	"erpfinance/internal/middleware"

	"github.com/gofiber/fiber/v2"
)

func AuthRouter(router *fiber.App, authHandler auth.AuthHandler) {
	app := router.Group("/api/v1/auth")

	app.Post("/login", authHandler.Login)
	app.Post("/register", authHandler.Register)
	app.Post("/refresh-token", authHandler.RefreshToken)
	app.Post("/logout", middleware.AuthMiddleware(), authHandler.Logout)
	app.Post("/change-password", middleware.AuthMiddleware(), authHandler.ChangePassword)
}
