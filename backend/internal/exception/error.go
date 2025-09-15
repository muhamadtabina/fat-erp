package exception

type Error struct {
	Message string
}

func NewError(message string) *Error {
	return &Error{Message: message}
}

func (e *Error) Error() string {
	return e.Message
}
