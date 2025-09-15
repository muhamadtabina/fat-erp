package middleware

import (
	"erpfinance/internal/helper"
	"erpfinance/internal/model/dto"

	"github.com/gofiber/fiber/v2"
)

func AuthMiddleware() fiber.Handler {
	return func(context *fiber.Ctx) error {
		token := context.Get("Authorization")
		if token == "" {
			return context.Status(fiber.StatusUnauthorized).JSON(dto.WebResponse{
				Code:    fiber.StatusUnauthorized,
				Status:  "UNAUTHORIZED",
				Message: "Missing authorization token",
				Data:    nil,
			})
		}

		// Remove Bearer prefix
		if len(token) > 7 {
			token = token[7:]
		}

		// Validate token (false karena ini bukan refresh token)
		claims, err := helper.ValidateToken(token, false)
		if err != nil {
			return context.Status(fiber.StatusUnauthorized).JSON(dto.WebResponse{
				Code:    fiber.StatusUnauthorized,
				Status:  "UNAUTHORIZED",
				Message: "Invalid or expired token",
				Data:    nil,
			})
		}

		// Set user information in context
		context.Locals("userID", claims.ID)
		context.Locals("userRole", claims.Role)

		return context.Next()
	}
}
