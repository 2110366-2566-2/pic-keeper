package user

import (
	"net/http"

	"github.com/Roongkun/software-eng-ii/internal/controller/user/fieldvalidate"
	"github.com/Roongkun/software-eng-ii/internal/controller/util"
	"github.com/Roongkun/software-eng-ii/internal/model"
	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
)

func (r *Resolver) UpdateUserProfile(c *gin.Context) {
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

	existingUser, err := r.UserUsecase.FindOneByUsername(c, updatingUserInput.Username)
	if err == nil && existingUser.ID != uuid.MustParse(*updatingUserInput.Username) {
		c.JSON(http.StatusConflict, gin.H{
			"status": "failed",
			"error":  "Username already exists.",
		})
		return
	} else if err != nil && err.Error() != "sql: no rows in result set" {
		// Handle unexpected error
		util.Raise500Error(c, "An unexpected error occurred.")
		return
	}

}
