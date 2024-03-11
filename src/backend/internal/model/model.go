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
	UserId        uuid.UUID `bun:"user_id,type:uuid,default:gen_random_uuid()" json:"user_id"`
	IsVerified    bool      `bun:"is_verified,type:boolean" json:"is_verified"`
}

type Administrator struct {
	bun.BaseModel `bun:"table:administrators,alias:admin"`
	Id            uuid.UUID `bun:"id,pk,type:uuid,default:gen_random_uuid()" json:"id"`
	Email         string    `bun:"email,type:varchar" json:"email"`
	Password      string    `bun:"password,type:varchar" json:"password"`
	LoggedOut     bool      `bun:"logged_out,type:boolean" json:"logged_out"`
}

type Package struct {
	bun.BaseModel  `bun:"table:packages,alias:packages"`
	Id             uuid.UUID `bun:"id,pk,type:uuid,default:gen_random_uuid()" json:"id"`
	PhotographerId uuid.UUID `bun:"photographer_id,type:uuid" json:"photographer_id"`
	Name           string    `bun:"name,type:varchar" json:"name"`
	Price          int       `bun:"price,type:integer" json:"price"`
}

type PackageInput struct {
	Name  *string `bun:"name,type:varchar" json:"name"`
	Price *int    `bun:"price,type:integer" json:"price"`
}

const (
	BookingPendingStatus                = "PENDING"
	BookingConfirmedStatus              = "CONFIRMED"
	BookingCancelledStatus              = "CANCELLED"
	BookingCustomerReqChangesStatus     = "C_REQ_CHANGES"
	BookingPhotographerReqChangesStatus = "P_REQ_CHANGES"
)

type BookingPurposal struct {
	CustomerId uuid.UUID `bun:"customer_id,type:uuid" json:"customer_id"`
	PackageId  uuid.UUID `bun:"package_id,type:uuid" json:"package_id"`
	StartTime  time.Time `bun:"start_time,type:timestamptz" json:"start_time"`
	EndTime    time.Time `bun:"end_time,type:timestamptz" json:"end_time"`
}

type Booking struct {
	bun.BaseModel `bun:"table:bookings,alias:bookings"`
	Id            uuid.UUID  `bun:"id,pk,type:uuid,default:gen_random_uuid()" json:"id"`
	CustomerId    uuid.UUID  `bun:"customer_id,type:uuid" json:"customer_id"`
	PackageId     uuid.UUID  `bun:"package_id,type:uuid" json:"package_id"`
	StartTime     time.Time  `bun:"start_time,type:timestamptz" json:"start_time"`
	EndTime       time.Time  `bun:"end_time,type:timestamptz" json:"end_time"`
	Status        string     `bun:"status,type:varchar" json:"status"`
	CreatedAt     time.Time  `bun:"created_at,type:timestamptz,default:now()" json:"created_at"`
	UpdatedAt     time.Time  `bun:"updated_at,type:timestamptz,default:now()" json:"updated_at"`
	DeletedAt     *time.Time `bun:"deleted_at,soft_delete,nullzero,type:timestamptz" json:"deleted_at"`
}
