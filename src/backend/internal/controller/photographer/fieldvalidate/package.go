package fieldvalidate

import (
	"errors"

	"github.com/Roongkun/software-eng-ii/internal/model"
)

func CreatePackage(input model.PackageInput) []error {
	fieldErrs := []error{}

	if input.Name == nil {
		fieldErrs = append(fieldErrs, errors.New(
			"the name of the new package must be provided",
		))
	}
	if input.Price == nil {
		fieldErrs = append(fieldErrs, errors.New(
			"the price of the new package must be provided",
		))
	}

	return fieldErrs
}

func UpdatePackage(input model.PackageInput) []error {
	fieldErrs := []error{}

	if input.Name == nil && input.Price == nil {
		fieldErrs = append(fieldErrs, errors.New(
			"one of the package fields must be changed",
		))
	}

	return fieldErrs
}
