package handlers

import (
	"database/sql"
	"encoding/json"
	"net/http"

	"dojo_gym/backend/models"
)

func GetAllMembers(db *sql.DB) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		members, err := models.GetAllMembers(db)
		if err != nil {
			http.Error(w, "Database error", http.StatusInternalServerError)
			return
		}
		w.Header().Set("Content-Type", "application/json")
		_ = json.NewEncoder(w).Encode(members)
	}
}