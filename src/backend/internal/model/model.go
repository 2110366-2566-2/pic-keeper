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

const (
	PhotographerNotVerifiedStatus = "NOT_VERIFIED"
	PhotographerPendingStatus     = "PENDING"
	PhotographerVerifiedStatus    = "VERIFIED"
	PhotographerRejectedStatus    = "REJECTED"
)

const (
	MALE   = "MALE"
	FEMALE = "FEMALE"
	OTHER  = "OTHER"
)

type User struct {
	bun.BaseModel      `bun:"table:users,alias:u"`
	Id                 uuid.UUID `bun:"id,pk,type:uuid,default:gen_random_uuid()" json:"id"`
	Username           string    `bun:"username,type:varchar" json:"username"`
	Email              string    `bun:"email,type:varchar" json:"email"`
	Provider           *string   `bun:"provider,type:varchar" json:"provider"`
	Password           *string   `bun:"password,type:varchar" json:"-"`
	LoggedOut          bool      `bun:"logged_out,type:boolean" json:"logged_out"`
	ProfilePictureKey  *string   `bun:"profile_picture_key,type:varchar" json:"profile_picture_key"`
	Firstname          string    `bun:"firstname,type:varchar" json:"firstname"`
	Lastname           string    `bun:"lastname,type:varchar" json:"lastname"`
	VerificationStatus string    `bun:"verification_status,type:varchar" json:"verification_status"`
	About              string    `bun:"about,type:varchar" json:"about"`
	Location           string    `bun:"location,type:varchar" json:"location"`
	PhoneNumber        string    `bun:"phone_number,type:varchar" json:"phone_number"`
	Gender             string    `bun:"gender,type:varchar" json:"gender"`
}

type UserInput struct {
	Email     string  `json:"email" example:"test@mail.com"`
	Password  *string `json:"password" example:"root"`
	Firstname string  `json:"firstname" example:"test"`
	Lastname  string  `json:"lastname" example:"test"`
}

type UserUpdateInput struct {
	Email       *string `json:"email" example:"test@mail.com"`
	Password    *string `json:"password" example:"root"`
	PhoneNumber *string `json:"phone_number" example:"096198923"`
	Firstname   *string `json:"firstname" example:"test"`
	Lastname    *string `json:"lastname" example:"test"`
	Gender      *string `json:"gender" example:"Male"`
	About       *string `json:"about" example:"Hello"`
	Username    *string `json:"username" example:"test"`
	Location    *string `bun:"name,type:varchar" json:"location"`
}

type Administrator struct {
	bun.BaseModel `bun:"table:administrators,alias:admin"`
	Id            uuid.UUID `bun:"id,pk,type:uuid,default:gen_random_uuid()" json:"id"`
	Email         string    `bun:"email,type:varchar" json:"email"`
	Password      string    `bun:"password,type:varchar" json:"password"`
	LoggedOut     bool      `bun:"logged_out,type:boolean" json:"logged_out"`
}

type Gallery struct {
	bun.BaseModel  `bun:"table:galleries,alias:galleries"`
	Id             uuid.UUID `bun:"id,pk,type:uuid,default:gen_random_uuid()" json:"id"`
	PhotographerId uuid.UUID `bun:"photographer_id,type:uuid" json:"photographer_id"`
	Location       string    `bun:"location,type:varchar" json:"location"`
	Name           string    `bun:"name,type:varchar" json:"name"`
	Price          int       `bun:"price,type:integer" json:"price"`
}

type GalleryInput struct {
	Name     *string `bun:"name,type:varchar" json:"name"`
	Location *string `bun:"name,type:varchar" json:"location"`
	Price    *int    `bun:"price,type:integer" json:"price"`
}

const (
	BookingPaidStatus                  = "USER_PAID"
	BookingCancelledStatus             = "CANCELLED"
	BookingCustomerReqCancelStatus     = "C_REQ_CANCEL"
	BookingPhotographerReqCancelStatus = "P_REQ_CANCEL"
	BookingCompletedStatus             = "COMPLETED"
	BookingPaidOutStatus               = "PAID_OUT"
)

type BookingProposal struct {
	GalleryId uuid.UUID `bun:"gallery_id,type:uuid" json:"gallery_id"`
	StartTime time.Time `bun:"start_time,type:timestamptz" json:"start_time"`
	EndTime   time.Time `bun:"end_time,type:timestamptz" json:"end_time"`
}

type Booking struct {
	bun.BaseModel `bun:"table:bookings,alias:bookings"`
	Id            uuid.UUID `bun:"id,pk,type:uuid,default:gen_random_uuid()" json:"id"`
	CustomerId    uuid.UUID `bun:"customer_id,type:uuid" json:"customer_id"`
	GalleryId     uuid.UUID `bun:"gallery_id,type:uuid" json:"-"`
	Gallery       Gallery   `bun:"-" json:"gallery"`
	StartTime     time.Time `bun:"start_time,type:timestamptz" json:"start_time"`
	EndTime       time.Time `bun:"end_time,type:timestamptz" json:"end_time"`
	Status        string    `bun:"status,type:varchar" json:"status"`
	CreatedAt     time.Time `bun:"created_at,type:timestamptz,default:now()" json:"created_at"`
	UpdatedAt     time.Time `bun:"updated_at,type:timestamptz,default:now()" json:"updated_at"`
}

type SearchFilter struct {
	PhotographerId *uuid.UUID `form:"photographer_id"`
	Location       *string    `form:"location"`
	MinPrice       *int       `form:"min_price"`
	MaxPrice       *int       `form:"max_price"`
}

type Room struct {
	bun.BaseModel `bun:"table:rooms,alias:rooms"`
	Id            uuid.UUID  `bun:"id,pk,type:uuid,default:gen_random_uuid()" json:"id"`
	GalleryId     uuid.UUID  `bun:"gallery_id,type:uuid" json:"-"`
	Gallery       Gallery    `bun:"-" json:"gallery"`
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

type RoomMemberInput struct {
	MemberIds []uuid.UUID `binding:"required" json:"member_ids"`
	GalleryId uuid.UUID   `json:"gallery_id"`
}

type Photo struct {
	bun.BaseModel `bun:"table:photos,alias:photos"`
	Id            uuid.UUID `bun:"id,pk,type:uuid,default:gen_random_uuid()" json:"id"`
	GalleryId     uuid.UUID `bun:"gallery_id,type:uuid" json:"gallery_id"`
	PhotoKey      string    `bun:"photo_key,type:varchar" json:"photo_key"`
}
