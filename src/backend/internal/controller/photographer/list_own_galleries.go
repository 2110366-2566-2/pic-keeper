package photographer

import (
	"net/http"

	"github.com/Roongkun/software-eng-ii/internal/controller/util"
	"github.com/Roongkun/software-eng-ii/internal/model"
	"github.com/gin-gonic/gin"
)

func (r *Resolver) ListOwnGalleries(c *gin.Context) {
	user, exists := c.Get("user")
	if !exists {
		util.Raise400Error(c, "Failed to retrieve photographer from context")
		return
	}

	userObj, ok := user.(model.User)
	if !ok {
		util.Raise400Error(c, "Invalid object type in context")
		return
	}

	allGalleries, err := r.GalleryUsecase.FindByPhotographerId(c, userObj.Id)
	if err != nil {
		util.Raise500Error(c, err)
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"status": "success",
		"data":   allGalleries,
	})
}
