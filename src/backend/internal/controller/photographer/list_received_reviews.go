package photographer

import (
	"net/http"

	"github.com/Roongkun/software-eng-ii/internal/controller/util"
	"github.com/gin-gonic/gin"
)

func (r *Resolver) ListReceivedReviews(c *gin.Context) {
	photographer, ok := getPhotographer(c)
	if !ok {
		return
	}

	reviews, err := r.ReviewUsecase.FindByPhotographerId(c, photographer.Id)
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
