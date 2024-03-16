package user

import (
	"errors"
	"math/rand"
	"net/http"

	"github.com/Roongkun/software-eng-ii/internal/controller/user/fieldvalidate"
	"github.com/Roongkun/software-eng-ii/internal/controller/util"
	"github.com/Roongkun/software-eng-ii/internal/model"
	"github.com/gin-gonic/gin"
	"golang.org/x/crypto/bcrypt"
)

func (r *Resolver) UpdateUserProfile(c *gin.Context) {

	user := c.MustGet("user")
	userObj, ok := user.(model.User)
	if !ok {
		err := errors.New("Invalid user type in context")
		util.Raise500Error(c, err)
		return
	}

	updatingUserInput := model.UserUpdateInput{}
	if err := c.BindJSON(&updatingUserInput); err != nil {
		util.Raise400Error(c, "unable to bind request body with json model, please recheck")
		return
	}

	if fieldErrs := fieldvalidate.UpdateUser(updatingUserInput); len(fieldErrs) > 0 {
		c.JSON(http.StatusBadRequest, gin.H{
			"status": "failed",
			"error":  util.JSONErrs(fieldErrs),
		})
		c.Abort()
		return
	}

	if updatingUserInput.Username != nil {
		existingUser, err := r.UserUsecase.FindOneByUsername(c, *updatingUserInput.Username)
		if err == nil && existingUser.Id != userObj.Id {
			c.JSON(http.StatusConflict, gin.H{
				"status": "failed",
				"error":  "Username already exists.",
			})
			return
		} else if err != nil && err.Error() != "sql: no rows in result set" {
			util.Raise500Error(c, err)
			return
		}
	}

	if updatingUserInput.About != nil {
		userObj.About = updatingUserInput.About
	}

	// Update Email if provided
	if updatingUserInput.Email != nil {
		userObj.Email = *updatingUserInput.Email
	}

	// Update Password if provided
	if updatingUserInput.Password != nil {
		// Note: Ensure the password is hashed before storing
		hashedPassword, hashErr := bcrypt.GenerateFromPassword(([]byte)(*updatingUserInput.Password), rand.Intn(bcrypt.MinCost))
		if hashErr != nil {
			util.Raise500Error(c, hashErr)
			return
		}
		hashedStr := string(hashedPassword)
		userObj.Password = &hashedStr
	}

	// Update PhoneNumber if provided
	if updatingUserInput.PhoneNumber != nil {
		userObj.PhoneNumber = updatingUserInput.PhoneNumber
	}

	// Update Firstname if provided
	if updatingUserInput.Firstname != nil {
		userObj.Firstname = *updatingUserInput.Firstname
	}

	// Update Lastname if provided
	if updatingUserInput.Lastname != nil {
		userObj.Lastname = *updatingUserInput.Lastname
	}

	// Update Gender if provided
	if updatingUserInput.Gender != nil {
		userObj.Gender = updatingUserInput.Gender
	}

	// Update Location if provided
	if updatingUserInput.Location != nil {
		userObj.Location = updatingUserInput.Location
	}

	if updatingUserInput.Username != nil {
		userObj.Username = *updatingUserInput.Username
	}

	// Finally, update the user in the database
	if err := r.UserUsecase.UserRepo.UpdateOne(c, &userObj); err != nil {
		util.Raise500Error(c, err)
		return
	}

	c.Set("user", userObj)

	c.JSON(http.StatusOK, gin.H{
		"status": "success",
		"data":   userObj,
	})

}
