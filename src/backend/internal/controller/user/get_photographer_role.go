package user

import (
	"net/http"

	"github.com/Roongkun/software-eng-ii/internal/model"
	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
)

func (r *Resolver) RequestPhotographerRole(c *gin.Context) {
	user, exists := c.Get("user")
	if !exists {
		c.JSON(http.StatusInternalServerError, gin.H{"status": "failed", "error": "Failed to retrieve user from context"})
		c.Abort()
		return
	}
	userObj, ok := user.(model.User)
	if !ok {
		c.JSON(http.StatusInternalServerError, gin.H{"status": "failed", "error": "Invalid user type in context"})
		c.Abort()
		return
	}

	// database validate
	exist, err := r.PhotographerUsecase.PhotographerRepo.CheckExistenceByUserId(c, userObj.Id)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"status": "failed", "error": err.Error()})
		c.Abort()
		return
	}
	if exist {
		c.JSON(http.StatusForbidden, gin.H{"status": "failed", "error": "User is already a photographer"})
		c.Abort()
		return
	}

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
