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

func updateUserFieldsFromInput(userObj model.User, updatingUserInput model.UserUpdateInput) (model.User, error) {
	updatedUser := userObj // Create a copy of the user object to modify

	if updatingUserInput.About != nil {
		updatedUser.About = updatingUserInput.About
	}
	if updatingUserInput.Email != nil {
		updatedUser.Email = *updatingUserInput.Email
	}
	if updatingUserInput.Password != nil {
		hashedPassword, err := bcrypt.GenerateFromPassword([]byte(*updatingUserInput.Password), rand.Intn(bcrypt.MaxCost-bcrypt.MinCost)+bcrypt.MinCost)
		if err != nil {
			return model.User{}, err // Return the error to be handled by the caller
		}
		hashedStr := string(hashedPassword)
		updatedUser.Password = &hashedStr
	}
	if updatingUserInput.PhoneNumber != nil {
		updatedUser.PhoneNumber = updatingUserInput.PhoneNumber
	}
	if updatingUserInput.Firstname != nil {
		updatedUser.Firstname = *updatingUserInput.Firstname
	}
	if updatingUserInput.Lastname != nil {
		updatedUser.Lastname = *updatingUserInput.Lastname
	}
	if updatingUserInput.Gender != nil {
		updatedUser.Gender = updatingUserInput.Gender
	}
	if updatingUserInput.Address != nil {
		updatedUser.Address = updatingUserInput.Address
	}
	if updatingUserInput.Username != nil {
		updatedUser.Username = *updatingUserInput.Username
	}

	return updatedUser, nil // Return the updated user object
}

func (r *Resolver) UpdateUserProfile(c *gin.Context) {

	user := c.MustGet("user")
	userObj, ok := user.(model.User)
	if !ok {
		err := errors.New("invalid user type in context")
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
		exist, err := r.UserUsecase.CheckUsernameAlreadyBeenUsed(c, *updatingUserInput.Username, userObj.Id)
		if err != nil {
			util.Raise500Error(c, err)
			return
		} else if exist {
			util.Raise409Error(c, "username already exist")
			return
		}
	}

	updatedUser, err := updateUserFieldsFromInput(userObj, updatingUserInput)
	if err != nil {
		util.Raise500Error(c, err)
		return
	}

	if err := r.UserUsecase.UserRepo.UpdateOne(c, &updatedUser); err != nil {
		util.Raise500Error(c, err)
		return
	}

	c.Set("user", updatedUser)
	c.JSON(http.StatusOK, gin.H{"status": "success", "data": updatedUser})

}
