package photographer

import (
	"net/http"

	"github.com/Roongkun/software-eng-ii/internal/model"
	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
)

func (r *Resolver) GetPhotographerRole(c *gin.Context) {
	user, exists := c.Get("user")
	if !exists {
		c.JSON(http.StatusInternalServerError, gin.H{"status": "failed", "message": "Failed to retrieve user from context"})
		c.Abort()
		return
	}
	userObj, ok := user.(model.User)
	if !ok {
		c.JSON(http.StatusInternalServerError, gin.H{"status": "failed", "message": "Invalid user type in context"})
		c.Abort()
		return
	}

	// if the user is already a photographer, he cannot get role again (not sure if this case is already checked before doing the get-role or not)
	// ** not done, may need to write func in photographer usecase that can find user_id in photographer table
	// _, err := r.PhotographerUsecase.PhotographerRepo.FindOneById(c, userObj.Id)
	// if err == nil {
	// 	c.JSON(http.StatusInternalServerError, gin.H{"status": "failed", "message": "User is already a photographer"})
	// 	c.Abort()
	// 	return
	// }

	photographerModel := model.Photographer{
		Id:         uuid.New(),
		UserId:     userObj.Id,
		IsVerified: false,
	}

	if err := r.PhotographerUsecase.PhotographerRepo.AddOne(c, &photographerModel); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"status": "failed",
			"error":  err.Error(),
		})
		c.Abort()
		return
	}

	c.JSON(http.StatusCreated, gin.H{
		"status": "success",
		"data":   photographerModel,
	})
}
