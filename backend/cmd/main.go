// @title ERP Finance API
// @version 1.0
// @description API documentation for ERP Finance application
// @host localhost:5173
// @BasePath /api
package main

import (
	_ "erpfinance/docs"
	"erpfinance/internal/config"
	"erpfinance/internal/helper"
	"erpfinance/internal/migrations"
	"erpfinance/internal/routes"
	"fmt"
	"log"
	"os"
	"path/filepath"
	"runtime"
	"time"

	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/cors"
	"github.com/gofiber/fiber/v2/middleware/logger"
	"github.com/joho/godotenv"
	fiberSwagger "github.com/arsmn/fiber-swagger/v2"
)

func getProjectRoot() string {
	_, b, _, ok := runtime.Caller(0)
	if !ok {
		log.Fatal("Tidak dapat menemukan path proyek")
	}
	return filepath.Join(filepath.Dir(b), "..")
}

func main() {
	projectRoot := getProjectRoot()

	envPath := filepath.Join(projectRoot, ".env")
	err := godotenv.Load(envPath)
	if err != nil {
		log.Printf("Peringatan: Gagal memuat file .env dari %s. Error: %v", envPath, err)
	}
	
	// Init DB
	config.InitDB()
	db := config.DB

	// Jalankan migrasi
	err = migrations.Migrate(db)
	helper.PanicIfError(err)

	// Dapatkan koneksi sql native & defer close
	sqlDB, err := db.DB()
	helper.PanicIfError(err)
	defer sqlDB.Close()

	// Inisialisasi Fiber
	app := fiber.New(fiber.Config{
		IdleTimeout:  time.Second * 5,
		WriteTimeout: time.Second * 5,
		ReadTimeout:  time.Second * 5,
	})

	// Middleware
	app.Use(logger.New())
	app.Use(cors.New(cors.Config{
		AllowOrigins:     os.Getenv("CORS_PORT"),
		AllowHeaders:     "Origin, Content-Type, Accept, Authorization",
		AllowCredentials: true,
	}))

	// Inisialisasi Handlers via Google Wire
	authHandler, err := config.InitializeAuthHandler(db)
	helper.PanicIfError(err)

	usersHandler, err := config.InitializeUsersHandler(db)
	helper.PanicIfError(err)

	// Register routes
	routes.AuthRouter(app, authHandler)
	routes.UsersRouter(app, usersHandler)

	// Swagger documentation
	app.Get("/swagger/*", fiberSwagger.HandlerDefault)

	// Jalankan server
	ip := os.Getenv("SERVER_HOST")
	if ip == "" {
		ip = "localhost"
	}
	port := os.Getenv("SERVER_PORT")
	if port == "" {
		port = "5000"
	}
	fmt.Printf("Server running at http://%s:%s\n", ip, port)
	err = app.Listen(ip + ":" + port)
	helper.PanicIfError(err)
}