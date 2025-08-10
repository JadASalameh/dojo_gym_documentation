package main

import (
	"fmt"
	"log"
	"net/http"

	"dojo_gym/backend/app"
)

func main() {
	application := app.NewApp()

	fmt.Println("🚀 Server running at http://localhost:8080")
	log.Fatal(http.ListenAndServe(":8080", application.Router))
}
