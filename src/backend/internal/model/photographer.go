package model

// RegisterPhotographerInput defines the data needed for registering a photographer.
type RegisterPhotographerInput struct {
	Name       string `json:"name" binding:"required"`
	Email      string `json:"email" binding:"required,email"`
	Password   string `json:"password" binding:"required"`
	IsVerified bool   `json:"is_verified"`
}
