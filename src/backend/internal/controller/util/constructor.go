package util

import (
	"net/http"

	userFieldValidate "github.com/Roongkun/software-eng-ii/internal/controller/user/fieldvalidate"
	"github.com/Roongkun/software-eng-ii/internal/model"
	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
)

func UserConstructor(c *gin.Context) (model.User, []error) {
	result := model.User{}
	errors := []error{}
	newUser := model.UserInput{}
	if err := c.BindJSON(&newUser); err != nil {
		c.Set("errorStatus", http.StatusBadRequest)
		c.Set("errorMessage", "could not bind request body into JSON format")
		errors = append(errors, err)
		return result, errors
	}

	if fieldErr := userFieldValidate.Register(newUser); len(fieldErr) > 0 {
		c.Set("errorStatus", http.StatusBadRequest)
		c.Set("errorMessage", "some input fields are incorrect")
		errors = append(errors, fieldErr...)
		return result, errors
	}

	result = model.User{
		Id:        uuid.New(),
		Name:      newUser.Name,
		Email:     newUser.Email,
		Password:  newUser.Password,
		LoggedOut: false,
	}

	return result, nil
}
