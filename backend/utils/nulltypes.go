package utils

import (
	"database/sql"
	"encoding/json"
	// "time"
)

// Nullable string
type NullString struct {
	sql.NullString
}

// Marshal JSON cleanly
func (ns NullString) MarshalJSON() ([]byte, error) {
	if ns.Valid {
		return json.Marshal(ns.String)
	}
	return json.Marshal(nil) // send null in JSON
}

// Nullable time
type NullTime struct {
	sql.NullTime
}

func (nt NullTime) MarshalJSON() ([]byte, error) {
	if nt.Valid {
		return json.Marshal(nt.Time.Format("2006-01-02"))
	}
	return json.Marshal(nil)
}
