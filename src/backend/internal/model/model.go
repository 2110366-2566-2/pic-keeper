package model

import (
	"github.com/google/uuid"
	"github.com/uptrace/bun"
)

type User struct {
	bun.BaseModel  `bun:"table:users, alias:u"`
	Id             uuid.UUID  `bun:"id,pk,type:uuid,default:gen_random_uuid()" json:"id"`
	Name           string     `bun:"name, type:varchar" json:"name"`
	Email          string     `bun:"email,type:varchar" json:"email"`
	Password       *string    `bun:"password, type:varchar" json:"password"`
	PhotographerId *uuid.UUID `bun:"photographer_id, type:uuid" json:"photographer_id"`
}

type Photographer struct {
	bun.BaseModel `bun:"table:photographers, alias:ph"`
	Id            uuid.UUID `bun:"id,pk,type:uuid, default:gen_random_uuid()" json:"id"`
	IsVerified    bool      `bun:"is_verified,type:boolean" json:"is_verified"`
}
