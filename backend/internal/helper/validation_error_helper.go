package helper

import (
	"fmt"
	"strings"

	"github.com/go-playground/validator/v10"
)

// ValidationError represents a validation error
type ValidationError struct {
	Field   string `json:"field"`
	Message string `json:"message"`
}

// TranslateError translates validation errors into custom messages
func TranslateError(err error) []ValidationError {
	var errors []ValidationError

	// Check if error is validator.ValidationErrors
	validatorErrs, ok := err.(validator.ValidationErrors)
	if !ok {
		// If not validation errors, return generic error
		return []ValidationError{{
			Field:   "general",
			Message: err.Error(),
		}}
	}

	for _, e := range validatorErrs {
		var message string

		// Get field and tag
		field := e.Field()
		tag := e.Tag()
		param := e.Param()

		// Custom messages based on validation tag
		switch tag {
		case "required":
			message = fmt.Sprintf("%s is required", formatFieldName(field))
		case "email":
			message = fmt.Sprintf("%s must be a valid email address", formatFieldName(field))
		case "min":
			if e.Kind().String() == "string" {
				message = fmt.Sprintf("%s must be at least %s characters long", formatFieldName(field), param)
			} else {
				message = fmt.Sprintf("%s must be at least %s", formatFieldName(field), param)
			}
		case "max":
			if e.Kind().String() == "string" {
				message = fmt.Sprintf("%s must not exceed %s characters", formatFieldName(field), param)
			} else {
				message = fmt.Sprintf("%s must not exceed %s", formatFieldName(field), param)
			}
		case "oneof":
			message = fmt.Sprintf("%s must be one of: %s", formatFieldName(field), strings.ReplaceAll(param, " ", ", "))
		case "uuid":
			message = fmt.Sprintf("%s must be a valid UUID", formatFieldName(field))
		case "eqfield":
			message = "Confirm password must match new password"
		case "gte":
			message = fmt.Sprintf("%s must be greater than or equal to %s", formatFieldName(field), param)
		case "lte":
			message = fmt.Sprintf("%s must be less than or equal to %s", formatFieldName(field), param)
		case "gt":
			message = fmt.Sprintf("%s must be greater than %s", formatFieldName(field), param)
		case "lt":
			message = fmt.Sprintf("%s must be less than %s", formatFieldName(field), param)
		case "numeric":
			message = fmt.Sprintf("%s must be a valid number", formatFieldName(field))
		case "alpha":
			message = fmt.Sprintf("%s must contain only alphabetic characters", formatFieldName(field))
		case "alphanum":
			message = fmt.Sprintf("%s must contain only alphanumeric characters", formatFieldName(field))
		case "len":
			message = fmt.Sprintf("%s must be exactly %s characters long", formatFieldName(field), param)
		default:
			message = fmt.Sprintf("%s failed validation for '%s'", formatFieldName(field), tag)
		}

		errors = append(errors, ValidationError{
			Field:   strings.ToLower(field),
			Message: message,
		})
	}

	return errors
}

// formatFieldName converts field name to more readable format
func formatFieldName(field string) string {
	// Convert camelCase to readable format
	var result strings.Builder
	for i, r := range field {
		if i > 0 && r >= 'A' && r <= 'Z' {
			result.WriteRune(' ')
		}
		if i == 0 {
			result.WriteRune(r)
		} else {
			result.WriteRune(r)
		}
	}
	return result.String()
}

// FormatValidationError formats validation errors into a single error message
func FormatValidationError(err error) error {
	var messages []string
	for _, e := range TranslateError(err) {
		messages = append(messages, e.Message)
	}
	return fmt.Errorf("%s", strings.Join(messages, "; "))
}
