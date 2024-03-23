package user

import (
	"net/http"

	"github.com/Roongkun/software-eng-ii/internal/controller/util"
	"github.com/Roongkun/software-eng-ii/internal/model"
	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
)

func (r *Resolver) SearchGalleries(c *gin.Context) {
	searchFilter := model.SearchFilter{}
	if err := c.BindQuery(&searchFilter); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"status":  "failed",
			"error":   err.Error(),
			"message": "unable to bind request body with json, please recheck",
		})
		c.Abort()
		return
	}

	// fieldvalidate
	if searchFilter.PhotographerId != nil && searchFilter.PhotographerName != nil {
		util.Raise400Error(c, "searching with photographer's id is specific, the photographer's name should not be given")
		return
	}

	if searchFilter.PhotographerName != nil {
		photographerIds := []uuid.UUID{}
		matchedPhotographerIds, err := r.UserUsecase.FindPhotograperIdsNameAlike(c, *searchFilter.PhotographerName)
		if err != nil {
			util.Raise500Error(c, err)
			return
		}
		photographerIds = append(photographerIds, matchedPhotographerIds...)
		searchFilter.MatchedConditionPhotographerIds = photographerIds
	}

	targetGalleries, err := r.GalleryUsecase.SearchWithFilter(c, &searchFilter)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"status": "failed",
			"error":  err.Error(),
		})
		c.Abort()
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"status": "success",
		"data":   targetGalleries,
	})
}
