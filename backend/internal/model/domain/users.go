package domain

import (
	"time"

	"github.com/google/uuid"
)

type Role string

const (
	RoleSuperAdmin Role = "Admin"
)

type Users struct {
	ID        uuid.UUID `gorm:"type:uuid;primaryKey;" json:"id"`
	Name      string    `json:"name" gorm:"not null;column:name"`
	Email     string    `json:"email" gorm:"not null;unique;column:email"`
	Password  string    `json:"password" gorm:"not null;column:password"`
	Role      Role      `json:"role" gorm:"not null;column:role"`
	CreatedAt time.Time `gorm:"autoCreateTime" json:"created_at"`
	UpdatedAt time.Time `gorm:"autoUpdateTime" json:"updated_at"`
}
