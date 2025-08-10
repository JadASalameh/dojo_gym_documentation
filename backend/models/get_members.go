package models

import "database/sql"

func GetAllMembers(db *sql.DB) ([]Member, error) {
	rows, err := db.Query(`
		SELECT member_id, first_name, last_name, gender, date_of_birth, phone_number, email
		FROM members
		ORDER BY member_id`)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var members []Member
	for rows.Next() {
		var m Member
		if err := rows.Scan(&m.ID, &m.FirstName, &m.LastName, &m.Gender, &m.DOB, &m.Phone, &m.Email); err != nil {
			return nil, err
		}
		members = append(members, m)
	}

	return members, nil
}
