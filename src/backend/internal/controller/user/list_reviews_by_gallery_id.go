package user

import (
	"net/http"

	"github.com/Roongkun/software-eng-ii/internal/controller/util"
	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
)

func (r *Resolver) ListReviewsByGalleryId(c *gin.Context) {
	paramId := c.Param("id")
	galleryId := uuid.MustParse(paramId)

	reviews, err := r.ReviewUsecase.FindByGalleryId(c, galleryId)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"status": "failed",
			"error":  err.Error(),
		})
		c.Abort()
		return
	}

	if err := r.BookingUsecase.PopulateBookingInReviews(c, r.GalleryUsecase, r.RoomUsecase, reviews...); err != nil {
		util.Raise500Error(c, err)
		return
	}

	if err := r.UserUsecase.PopulateCustomerInReviews(c, reviews...); err != nil {
		util.Raise500Error(c, err)
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"status": "success",
		"data":   reviews,
	})
}
