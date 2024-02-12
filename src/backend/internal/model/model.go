package model

import (
	"github.com/google/uuid"
	"github.com/uptrace/bun"
)

type ContextKey string
type LoginCredentials struct {
	Email    string `json:"email"`
	Password string `json:"password"`
}

type User struct {
	bun.BaseModel     `bun:"table:users,alias:u"`
	Id                uuid.UUID `bun:"id,pk,type:uuid,default:gen_random_uuid()" json:"id"`
	Name              string    `bun:"name,type:varchar" json:"name"`
	Email             string    `bun:"email,type:varchar" json:"email"`
	Provider          *string   `bun:"provider,type:varchar" json:"provider"`
	Password          *string   `bun:"password,type:varchar" json:"password"`
	LoggedOut         bool      `bun:"logged_out,type:boolean" json:"logged_out"`
	ProfilePictureKey *string   `bun:"profile_picture_key,type:varchar" json:"profile_picture_key"`
}

type UserInput struct {
	Name     string  `json:"name"`
	Email    string  `json:"email"`
	Password *string `json:"password"`
}

type Photographer struct {
	bun.BaseModel `bun:"table:photographers,alias:ph"`
	Id            uuid.UUID `bun:"id,pk,type:uuid, default:gen_random_uuid()" json:"id"`
	UserId        uuid.UUID `bun:"user_id,type:uuid, default:gen_random_uuid()" json:"user_id"`
	IsVerified    bool      `bun:"is_verified,type:boolean" json:"is_verified"`
}
