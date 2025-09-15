package migrations

import (
	"erpfinance/internal/model/domain"
	"log"

	"gorm.io/gorm"
)

func Migrate(db *gorm.DB) error {
	err := db.AutoMigrate(
		&domain.Users{},
		&domain.RefreshToken{},
	)
	if err != nil {
		log.Println("Migration failed:", err)
		return err
	}

	log.Println("Database migration successful.")
	return nil
}
