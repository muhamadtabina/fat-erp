package middleware

import (
	"erpfinance/internal/model/domain"
	"erpfinance/internal/model/dto"

	"github.com/gofiber/fiber/v2"
)

// RequireRoles checks if the user has one of the required roles
func RequireRoles(allowedRoles ...domain.Role) fiber.Handler {
	return func(context *fiber.Ctx) error {
		// Get user role from context (set by auth middleware)
		role := context.Locals("userRole")
		if role == nil {
			return context.Status(fiber.StatusUnauthorized).JSON(dto.WebResponse{
				Code:    fiber.StatusUnauthorized,
				Status:  "UNAUTHORIZED",
				Message: "Please login first",
			})
		}

		userRole := role.(domain.Role)

		// Admin dapat mengakses semua resource
		if userRole == domain.RoleSuperAdmin {
			return context.Next()
		}

		// Check if user's role is in allowed roles
		for _, allowedRole := range allowedRoles {
			if userRole == allowedRole {
				return context.Next()
			}
		}

		return context.Status(fiber.StatusForbidden).JSON(dto.WebResponse{
			Code:    fiber.StatusForbidden,
			Status:  "FORBIDDEN",
			Message: "You don't have permission to access this resource",
		})
	}
}

// IsAdmin middleware - hanya untuk Admin (dapat mengakses semua)
func IsAdmin() fiber.Handler {
	return RequireRoles(domain.RoleSuperAdmin)
}
