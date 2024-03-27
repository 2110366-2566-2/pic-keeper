package user

import (
	"net/http"

	"github.com/Roongkun/software-eng-ii/internal/controller/util"
	"github.com/Roongkun/software-eng-ii/internal/model"
	"github.com/gin-gonic/gin"
)

func (r *Resolver) MyReviews(c *gin.Context) {
	user := c.MustGet("user")
	userObj, ok := user.(model.User)
	if !ok {
		c.JSON(http.StatusInternalServerError, gin.H{"status": "failed", "message": "Invalid user type in context"})
		c.Abort()
		return
	}

	reviews, err := r.ReviewUsecase.FindByUserId(c, userObj.Id)
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
