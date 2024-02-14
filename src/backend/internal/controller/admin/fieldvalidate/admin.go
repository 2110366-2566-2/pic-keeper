package fieldvalidate

import (
	"errors"
	"regexp"
	"strings"

	"github.com/Roongkun/software-eng-ii/internal/model"
)

func LoginAdmin(cred model.LoginCredentials) []error {
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
