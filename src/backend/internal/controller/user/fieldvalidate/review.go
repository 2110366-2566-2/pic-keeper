package fieldvalidate

import (
	"errors"

	"github.com/Roongkun/software-eng-ii/internal/model"
)

func CreateReview(input model.ReviewInput) []error {
	fieldErrs := []error{}

	if input.BookingId == nil {
		fieldErrs = append(fieldErrs, errors.New(
			"the bookingId of the new review must be provided",
		))
	}
	if input.Rating == nil {
		fieldErrs = append(fieldErrs, errors.New(
			"the rating of the new review must be provided",
		))
	}
	if input.ReviewText == nil {
		fieldErrs = append(fieldErrs, errors.New(
			"the review text of the new review must be provided",
		))
	}

	return fieldErrs
}

func UpdateReview(input model.ReviewInput) []error {
	fieldErrs := []error{}

	if input.Rating == nil && input.ReviewText == nil {
		fieldErrs = append(fieldErrs, errors.New(
			"one of the review fields must be changed",
		))
	}

	return fieldErrs
}
