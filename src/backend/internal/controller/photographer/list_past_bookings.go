package photographer

import (
	"net/http"

	"github.com/Roongkun/software-eng-ii/internal/model"
	"github.com/gin-gonic/gin"
)

func (r *Resolver) ListPastBookings(c *gin.Context) {
	photographer := c.MustGet("photographer")
	photographerObj, ok := photographer.(model.Photographer)
	if !ok {
		c.JSON(http.StatusInternalServerError, gin.H{"status": "failed", "message": "Invalid user type in context"})
		c.Abort()
		return
	}

	acceptedStatus := []string{model.BookingCompletedStatus, model.BookingPaidOutStatus}
	bookings, err := r.BookingUsecase.FindByPhotographerIdWithStatus(c, photographerObj.Id, acceptedStatus...)
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
