package fieldvalidate

import (
	"errors"
	"strings"

	"regexp"

	"github.com/Roongkun/software-eng-ii/internal/model"
)

func LoginUser(cred model.LoginCredentials) []error {
	fieldErrs := []error{}

	// empty email
	if strings.TrimSpace(cred.Email) == "" {
		fieldErrs = append(fieldErrs, errors.New(
			"email must be specified",
		))
	} else {
		// email format
		emailRegex := regexp.MustCompile(`^[a-z0-9._%+\-]+@[a-z0-9.\-]+\.[a-z]{2,4}$`)
		if !emailRegex.MatchString(cred.Email) {
			fieldErrs = append(fieldErrs, errors.New(
				"invalid email address",
			))
		}
	}

	if cred.Password == "" {
		fieldErrs = append(fieldErrs, errors.New(
			"password must be specified",
		))
	}

	return fieldErrs
}

func Register(newUser model.UserInput) []error {
	fieldErrs := []error{}

	// empty and whitespace firstname
	if strings.TrimSpace(newUser.Firstname) == "" {
		fieldErrs = append(fieldErrs, errors.New(
			"firstname must be specified",
		))
	}

	// empty and whitespace lastname
	if strings.TrimSpace(newUser.Lastname) == "" {
		fieldErrs = append(fieldErrs, errors.New(
			"lastname must be specified",
		))
	}

	// empty email
	if strings.TrimSpace(newUser.Email) == "" {
		fieldErrs = append(fieldErrs, errors.New(
			"email must be specified",
		))
	} else {
		// email format
		emailRegex := regexp.MustCompile(`^[a-z0-9._%+\-]+@[a-z0-9.\-]+\.[a-z]{2,4}$`)
		if !emailRegex.MatchString(newUser.Email) {
			fieldErrs = append(fieldErrs, errors.New(
				"invalid email address",
			))
		}
	}

	// empty and whitespace password
	if newUser.Password == nil || strings.TrimSpace(*newUser.Password) == "" {
		fieldErrs = append(fieldErrs, errors.New(
			"password must be specified",
		))
	}

	return fieldErrs
}

func UpdateUser(input model.UserUpdateInput) []error {
	fieldErrs := []error{}

	if input.About == nil && input.Email == nil && input.Firstname == nil && input.Gender == nil && input.Lastname == nil && input.Address == nil && input.Password == nil && input.PhoneNumber == nil && input.Username == nil {
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
