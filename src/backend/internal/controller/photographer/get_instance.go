package photographer

import (
	"net/http"

	"github.com/Roongkun/software-eng-ii/internal/model"
	"github.com/gin-gonic/gin"
)

func (r *Resolver) GetPhotographerInstance(c *gin.Context) {
	user := c.MustGet("user")
	userObj, ok := user.(model.User)
	if !ok {
		c.JSON(http.StatusInternalServerError, gin.H{"status": "failed", "error": "Invalid user type in context"})
		c.Abort()
		return
	}

	photographer, err := r.PhotographerUsecase.PhotographerRepo.FindOneByUserId(c, userObj.Id)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"status": "failed",
			"error":  err.Error(),
		})
		c.Abort()
		return
	}

	c.Set("photographer", getPhotographerInstance(photographer))
	c.Next()
}

func getPhotographerInstance(photographer *model.Photographer) model.Photographer {
	return *photographer
}
