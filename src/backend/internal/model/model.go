package model

import (
	"time"

	"github.com/google/uuid"
	"github.com/uptrace/bun"
)

type ContextKey string
type LoginCredentials struct {
	Email    string `json:"email" example:"test@mail.com"`
	Password string `json:"password" example:"abc123"`
}

type User struct {
	bun.BaseModel     `bun:"table:users,alias:u"`
	Id                uuid.UUID `bun:"id,pk,type:uuid,default:gen_random_uuid()" json:"id"`
	Name              string    `bun:"name,type:varchar" json:"name"`
	Email             string    `bun:"email,type:varchar" json:"email"`
	Provider          *string   `bun:"provider,type:varchar" json:"provider"`
	Password          *string   `bun:"password,type:varchar" json:"-"`
	LoggedOut         bool      `bun:"logged_out,type:boolean" json:"logged_out"`
	ProfilePictureKey *string   `bun:"profile_picture_key,type:varchar" json:"profile_picture_key"`
}

type UserInput struct {
	Name     string  `json:"name" example:"test"`
	Email    string  `json:"email" example:"test@mail.com"`
	Password *string `json:"password" example:"root"`
}

type Photographer struct {
	bun.BaseModel `bun:"table:photographers,alias:ph"`
	Id            uuid.UUID `bun:"id,pk,type:uuid,default:gen_random_uuid()" json:"id"`
	UserId        uuid.UUID `bun:"user_id,type:uuid" json:"user_id"`
	IsVerified    bool      `bun:"is_verified,type:boolean" json:"is_verified"`
}

type Administrator struct {
	bun.BaseModel `bun:"table:administrators,alias:admin"`
	Id            uuid.UUID `bun:"id,pk,type:uuid,default:gen_random_uuid()" json:"id"`
	Email         string    `bun:"email,type:varchar" json:"email"`
	Password      string    `bun:"password,type:varchar" json:"password"`
	LoggedOut     bool      `bun:"logged_out,type:boolean" json:"logged_out"`
}

type Room struct {
	bun.BaseModel `bun:"table:rooms,alias:rooms"`
	Id            uuid.UUID  `bun:"id,pk,type:uuid,default:gen_random_uuid()" json:"id"`
	CreatedAt     time.Time  `bun:"created_at,type:timestamptz,default:now()" json:"created_at"`
	UpdatedAt     time.Time  `bun:"updated_at,type:timestamptz,default:now()" json:"updated_at"`
	DeletedAt     *time.Time `bun:"deleted_at,soft_delete,nullzero,type:timestamptz" json:"deleted_at"`
}

type UserRoomLookup struct {
	bun.BaseModel `bun:"table:user_room_lookup,alias:urlookup"`
	Id            uuid.UUID  `bun:"id,pk,type:uuid,default:gen_random_uuid()" json:"id"`
	UserId        uuid.UUID  `bun:"user_id,type:uuid" json:"user_id"`
	RoomId        uuid.UUID  `bun:"room_id,type:uuid" json:"room_id"`
	CreatedAt     time.Time  `bun:"created_at,type:timestamptz,default:now()" json:"created_at"`
	UpdatedAt     time.Time  `bun:"updated_at,type:timestamptz,default:now()" json:"updated_at"`
	DeletedAt     *time.Time `bun:"deleted_at,soft_delete,nullzero,type:timestamptz" json:"deleted_at"`
}

type Conversation struct {
	bun.BaseModel `bun:"table:conversations,alias:convs"`
	Id            uuid.UUID  `bun:"id,pk,type:uuid,default:gen_random_uuid()" json:"id"`
	Text          string     `bun:"text,type:varchar" json:"text"`
	UserId        uuid.UUID  `bun:"user_id,type:uuid" json:"user_id"`
	RoomId        uuid.UUID  `bun:"room_id,type:uuid" json:"room_id"`
	CreatedAt     time.Time  `bun:"created_at,type:timestamptz,default:now()" json:"created_at"`
	UpdatedAt     time.Time  `bun:"updated_at,type:timestamptz,default:now()" json:"updated_at"`
	DeletedAt     *time.Time `bun:"deleted_at,soft_delete,nullzero,type:timestamptz" json:"deleted_at"`
}
