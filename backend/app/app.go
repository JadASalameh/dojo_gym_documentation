package app

import (
	"database/sql"
	"fmt"
	"log"
	"os"

	"github.com/gorilla/mux"
	"github.com/joho/godotenv"
	_ "github.com/lib/pq"

	"dojo_gym/backend/handlers"
	
)

type App struct {
	DB     *sql.DB
	Router *mux.Router
}



func NewApp() *App {
	// Load .env file
	if err := godotenv.Load(".env"); err != nil {
		log.Fatal("Error loading .env file")
	}

	connStr := fmt.Sprintf(
		"host=%s port=%s user=%s password=%s dbname=%s sslmode=%s",
		getEnv("DB_HOST"),
		getEnv("DB_PORT"),
		getEnv("DB_USER"),
		getEnv("DB_PASSWORD"),
		getEnv("DB_NAME"),
		getEnv("DB_SSLMODE"),
	)

	db, err := sql.Open("postgres", connStr)
	if err != nil {
		log.Fatal("Error opening database:", err)
	}
	if err := db.Ping(); err != nil {
		log.Fatal("Cannot connect to database:", err)
	}

	app := &App{DB: db, Router: mux.NewRouter()}
	app.setRoutes()
	return app
}

func (a *App) setRoutes() {
	a.Router.HandleFunc("/api/members", handlers.GetAllMembers(a.DB)).Methods("GET")
}

func getEnv(key string) string {
	val, exists := os.LookupEnv(key)
	if !exists {
		log.Fatalf("Required environment variable %s is not set", key)
	}
	return val
}
