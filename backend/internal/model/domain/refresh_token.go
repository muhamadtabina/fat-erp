package domain

import (
	"time"

	"github.com/google/uuid"
)

type RefreshToken struct {
	ID        uuid.UUID `gorm:"type:uuid;primaryKey;" json:"id"`
	UserID    uuid.UUID `gorm:"type:uuid;not null;index;" json:"user_id"`
	Token     string    `gorm:"type:text;not null;unique;" json:"token"`
	ExpiresAt time.Time `gorm:"not null;" json:"expires_at"`
	CreatedAt time.Time `gorm:"autoCreateTime" json:"created_at"`
	UpdatedAt time.Time `gorm:"autoUpdateTime" json:"updated_at"`

	// Foreign key relationship
	User Users `gorm:"foreignKey:UserID;references:ID;constraint:OnDelete:CASCADE;" json:"user,omitempty"`
}

// TableName sets the table name for RefreshToken model
func (RefreshToken) TableName() string {
	return "refresh_tokens"
}