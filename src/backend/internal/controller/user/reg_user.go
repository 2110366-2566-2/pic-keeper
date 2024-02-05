package user

import (
	"net/http"

	"github.com/Roongkun/software-eng-ii/internal/model"
	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
)

func (r *Resolver) RegCustomer(c *gin.Context) {
	newUser := model.UserInput{}
	if err := c.BindJSON(&newUser); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error":   err.Error(),
			"message": "unable to bind request body with json, please recheck",
		})
		c.Abort()
		return
	}

	userModel := model.User{
		Id: uuid.New(),
	}
	//field validate

	// if fieldErr := fieldvalidate.LoginUser(cred); len(fieldErr) > 0 {
	// 	c.JSON(http.StatusBadRequest, gin.H{
	// 		"errors": util.JSONErrs(fieldErr),
	// 	})
	// 	c.Abort()
	// 	return
	// }

}
