package models

import "dojo_gym/backend/utils"

type Member struct {
    ID        int             `json:"id"`
    FirstName utils.NullString `json:"first_name"`
    LastName  utils.NullString `json:"last_name"`
    Gender    utils.NullString `json:"gender"`
    DOB       utils.NullTime   `json:"date_of_birth"`
    Phone     utils.NullString `json:"phone_number"`
    Email     utils.NullString `json:"email"`
}

