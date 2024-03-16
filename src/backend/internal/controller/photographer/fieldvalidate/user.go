package fieldvalidate

import (
	"errors"
	"regexp"

	"github.com/Roongkun/software-eng-ii/internal/model"
)

func UpdateUser(input model.UserUpdateInput) []error {
	fieldErrs := []error{}

	if input.About == nil && input.Email == nil && input.Firstname == nil && input.Gender == nil && input.Lastname == nil && input.Location == nil && input.Password == nil && input.PhoneNumber == nil && input.Username == nil {
		fieldErrs = append(fieldErrs, errors.New(
			"one of the update fields must be changed",
		))
	}
	if input.Gender != nil {
		validGender := *input.Gender == model.MALE || *input.Gender == model.FEMALE || *input.Gender == model.OTHER
		if !validGender {
			fieldErrs = append(fieldErrs, errors.New("gender must be MALE, FEMALE, or OTHER"))
		}
	}

	// Validate Email (simple regex example, consider a more comprehensive solution for production)
	if input.Email != nil {
		if !regexp.MustCompile(`^[a-z0-9._%+\-]+@[a-z0-9.\-]+\.[a-z]{2,4}$`).MatchString(*input.Email) {
			fieldErrs = append(fieldErrs, errors.New("invalid email format"))
		}
	}

	return fieldErrs
}
