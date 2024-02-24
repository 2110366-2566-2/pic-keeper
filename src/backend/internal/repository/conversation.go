package repository

import "github.com/Roongkun/software-eng-ii/internal/model"

type Conversation interface {
	BaseRepo[model.Conversation]
}
