package auth

type LogoutRequest struct {
	Token string `json:"token" validate:"required"`
}
