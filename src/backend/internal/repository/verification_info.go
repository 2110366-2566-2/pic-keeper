package repository

import "github.com/Roongkun/software-eng-ii/internal/model"

type VerificationInfo interface {
	BaseRepo[model.VerificationInformation]
}
