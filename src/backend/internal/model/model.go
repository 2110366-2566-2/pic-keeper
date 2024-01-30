package model

import (
	"github.com/google/uuid"
	"github.com/uptrace/bun"
)

type User struct {
	bun.BaseModel  `bun:"table:users, alias:u"`
	Id             uuid.UUID `bun:"id,pk,type:uuid,default:gen_random_uuid()" json:"id"`
	Name           string    `bun:"name, type:varchar" json:"name"`
	Email          *string   `bun:"email,type:varchar" json:"email"`
	Password       *string   `bun:"password, type:varchar" json:"password"`
	IsPhotographer bool      `bun:"is_photographer, type:boolean" json:"is_photographer"`
}
