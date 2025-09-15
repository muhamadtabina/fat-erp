package users

import (
	"erpfinance/internal/model/dto"
	"erpfinance/internal/model/dto/users"
	service "erpfinance/internal/service/users"
	"log"

	"github.com/gofiber/fiber/v2"
	"github.com/google/uuid"
)

type UsersHandlerImpl struct {
	UsersService service.UsersService
}

func NewUsersHandler(usersService service.UsersService) UsersHandler {
	return &UsersHandlerImpl{
		UsersService: usersService,
	}
}

// FindAll godoc
// @Summary Get all users with pagination
// @Description Get all users with pagination support
// @Tags users
// @Accept json
// @Produce json
// @Param Authorization header string true "Bearer token"
// @Param page query int false "Page number (default: 1)"
// @Param limit query int false "Items per page (default: 20, max: 100)"
// @Success 200 {object} dto.WebResponse
// @Failure 500 {object} dto.WebResponse
// @Router /api/users [get]
func (handler *UsersHandlerImpl) FindAll(ctx *fiber.Ctx) error {
	// Mulai dengan nilai default untuk paginasi
	pagination := dto.PaginationRequest{
		Page:  1,
		Limit: 20,
	}

	// Timpa dengan parameter query dari user jika ada
	if err := ctx.QueryParser(&pagination); err != nil {
		// Jika format query salah, tetap gunakan default. Bisa ditambahkan log jika perlu.
		log.Printf("Warning: Could not parse pagination query: %v. Using default values.", err)
	}

	// Validasi nilai setelah parsing untuk memastikan berada dalam rentang yang wajar
	if pagination.Page <= 0 {
		pagination.Page = 1
	}
	if pagination.Limit <= 0 || pagination.Limit > 100 { // Batasi limit maksimum untuk performa
		pagination.Limit = 20
	}

	// Panggil service dengan pagination
	paginationResponse, err := handler.UsersService.FindAllWithPagination(ctx.Context(), pagination)
	if err != nil {
		log.Printf("ERROR: Failed to find all users with pagination: %v", err)
		return ctx.Status(fiber.StatusInternalServerError).JSON(dto.WebResponse{
			Code:    fiber.StatusInternalServerError,
			Status:  "INTERNAL SERVER ERROR",
			Message: "An error occurred while retrieving users.",
		})
	}

	return ctx.Status(fiber.StatusOK).JSON(dto.WebResponse{
		Code:    fiber.StatusOK,
		Status:  "OK",
		Message: "Users retrieved successfully",
		Data:    paginationResponse,
	})
}

// FindById godoc
// @Summary Get user by ID
// @Description Get user details by user ID
// @Tags users
// @Accept json
// @Produce json
// @Param Authorization header string true "Bearer token"
// @Param id path string true "User ID (UUID)"
// @Success 200 {object} dto.WebResponse
// @Failure 400 {object} dto.WebResponse
// @Failure 404 {object} dto.WebResponse
// @Router /api/users/{id} [get]
func (handler *UsersHandlerImpl) FindById(ctx *fiber.Ctx) error {
	id, err := uuid.Parse(ctx.Params("id"))
	if err != nil {
		return ctx.Status(fiber.StatusBadRequest).JSON(dto.WebResponse{
			Code:    fiber.StatusBadRequest,
			Status:  "BAD REQUEST",
			Message: "Invalid user ID format. Please provide a valid UUID.",
		})
	}

	user, err := handler.UsersService.FindById(ctx.Context(), id)
	if err != nil {
		// Service mengembalikan error "user not found", jadi kita petakan ke 404
		return ctx.Status(fiber.StatusNotFound).JSON(dto.WebResponse{
			Code:    fiber.StatusNotFound,
			Status:  "NOT FOUND",
			Message: "User with the specified ID was not found.",
		})
	}

	return ctx.Status(fiber.StatusOK).JSON(dto.WebResponse{
		Code:    fiber.StatusOK,
		Status:  "OK",
		Message: "User retrieved successfully",
		Data:    user,
	})
}

// Update godoc
// @Summary Update user
// @Description Update user information by ID
// @Tags users
// @Accept json
// @Produce json
// @Param Authorization header string true "Bearer token"
// @Param id path string true "User ID (UUID)"
// @Param request body users.UsersUpdateRequest true "Update user request"
// @Success 200 {object} dto.WebResponse
// @Failure 400 {object} dto.WebResponse
// @Failure 404 {object} dto.WebResponse
// @Failure 409 {object} dto.WebResponse
// @Router /api/users/{id} [put]
func (handler *UsersHandlerImpl) Update(ctx *fiber.Ctx) error {
	id, err := uuid.Parse(ctx.Params("id"))
	if err != nil {
		return ctx.Status(fiber.StatusBadRequest).JSON(dto.WebResponse{
			Code:    fiber.StatusBadRequest,
			Status:  "BAD REQUEST",
			Message: "Invalid user ID format. Please provide a valid UUID.",
		})
	}

	var request users.UsersUpdateRequest
	if err := ctx.BodyParser(&request); err != nil {
		return ctx.Status(fiber.StatusBadRequest).JSON(dto.WebResponse{
			Code:    fiber.StatusBadRequest,
			Status:  "BAD REQUEST",
			Message: "Invalid request body format.",
		})
	}

	if err := handler.UsersService.Update(ctx.Context(), id, request); err != nil {
		// Periksa jenis error dari service untuk memberikan respons HTTP yang tepat
		switch err.Error() {
		case "user not found":
			return ctx.Status(fiber.StatusNotFound).JSON(dto.WebResponse{
				Code:    fiber.StatusNotFound,
				Status:  "NOT FOUND",
				Message: err.Error(),
			})
		case "email already exists":
			return ctx.Status(fiber.StatusConflict).JSON(dto.WebResponse{ // 409 Conflict lebih sesuai
				Code:    fiber.StatusConflict,
				Status:  "CONFLICT",
				Message: err.Error(),
			})
		default:
			// Untuk semua error lain yang tidak terduga, log dan kembalikan 500
			log.Printf("ERROR: Failed to update user with ID %s: %v", id, err)
			return ctx.Status(fiber.StatusInternalServerError).JSON(dto.WebResponse{
				Code:    fiber.StatusInternalServerError,
				Status:  "INTERNAL SERVER ERROR",
				Message: "An unexpected error occurred while updating the user.",
			})
		}
	}

	return ctx.Status(fiber.StatusOK).JSON(dto.WebResponse{
		Code:    fiber.StatusOK,
		Status:  "OK",
		Message: "User successfully updated",
	})
}

// Delete godoc
// @Summary Delete user
// @Description Delete user by ID
// @Tags users
// @Accept json
// @Produce json
// @Param Authorization header string true "Bearer token"
// @Param id path string true "User ID (UUID)"
// @Success 200 {object} dto.WebResponse
// @Failure 400 {object} dto.WebResponse
// @Failure 404 {object} dto.WebResponse
// @Failure 500 {object} dto.WebResponse
// @Router /api/users/{id} [delete]
func (handler *UsersHandlerImpl) Delete(ctx *fiber.Ctx) error {
	id, err := uuid.Parse(ctx.Params("id"))
	if err != nil {
		return ctx.Status(fiber.StatusBadRequest).JSON(dto.WebResponse{
			Code:    fiber.StatusBadRequest,
			Status:  "BAD REQUEST",
			Message: "Invalid user ID format. Please provide a valid UUID.",
		})
	}

	if err := handler.UsersService.Delete(ctx.Context(), id); err != nil {
		// Periksa jenis error dari service
		if err.Error() == "user not found" {
			return ctx.Status(fiber.StatusNotFound).JSON(dto.WebResponse{
				Code:    fiber.StatusNotFound,
				Status:  "NOT FOUND",
				Message: err.Error(),
			})
		}

		// Untuk error lainnya, log dan kembalikan 500
		log.Printf("ERROR: Failed to delete user with ID %s: %v", id, err)
		return ctx.Status(fiber.StatusInternalServerError).JSON(dto.WebResponse{
			Code:    fiber.StatusInternalServerError,
			Status:  "INTERNAL SERVER ERROR",
			Message: "An unexpected error occurred while deleting the user.",
		})
	}

	return ctx.Status(fiber.StatusOK).JSON(dto.WebResponse{
		Code:    fiber.StatusOK,
		Status:  "OK",
		Message: "User successfully deleted",
	})
}