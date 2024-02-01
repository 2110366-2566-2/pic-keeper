package fieldvalidate

import (
	"errors"

	"github.com/Roongkun/software-eng-ii/internal/model"
)

func LoginUser(cred model.LoginCredentials) []error {
	fieldErrs := []error{}

	// TODO: regex for email
	if cred.Email == "" {
		fieldErrs = append(fieldErrs, errors.New(
			"email must be specified",
		))
	}
	if cred.Password == "" {
		fieldErrs = append(fieldErrs, errors.New(
			"password must be specified",
		))
	}

	return fieldErrs
}
