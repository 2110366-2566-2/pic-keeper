package user

import (
	"net/http"

	"github.com/Roongkun/software-eng-ii/internal/model"
	"github.com/gin-gonic/gin"
)

func (r *Resolver) ListPastBookings(c *gin.Context) {
	userObj, ok := GetUser(c)
	if !ok {
		return
	}

	acceptedStatus := []string{model.BookingCompletedStatus, model.BookingPaidOutStatus}
	bookings, err := r.BookingUsecase.FindByUserIdWithStatus(c, userObj.Id, r.GalleryUsecase, r.RoomUsecase, acceptedStatus...)
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
		"data":   bookings,
	})
}
