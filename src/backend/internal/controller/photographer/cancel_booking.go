package photographer

import (
	"net/http"

	"github.com/Roongkun/software-eng-ii/internal/model"
	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
)

func (r *Resolver) CancelBooking(c *gin.Context) {
	photographer := c.MustGet("photographer")
	photographerObj, ok := photographer.(model.Photographer)
	if !ok {
		c.JSON(http.StatusInternalServerError, gin.H{"status": "failed", "message": "Invalid user type in context"})
		c.Abort()
		return
	}

	paramId := c.Param("id")
	bookingId := uuid.MustParse(paramId)

	booking, err := r.BookingUsecase.BookingRepo.FindOneById(c, bookingId)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"status": "failed",
			"error":  err.Error(),
		})
		c.Abort()
		return
	}

	if booking.Status != model.BookingPaidStatus {
		c.JSON(http.StatusForbidden, gin.H{
			"status": "failed",
			"error":  "this booking cannot be cancelled anymore",
		})
		c.Abort()
		return
	}

	pkg, err := r.PackageUsecase.PackageRepo.FindOneById(c, booking.PackageId)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"status": "failed",
			"error":  err.Error(),
		})
		c.Abort()
		return
	}

	if pkg.PhotographerId != photographerObj.Id {
		c.JSON(http.StatusForbidden, gin.H{
			"status": "failed",
			"error":  "this booking is not yours",
		})
		c.Abort()
		return
	}

	booking.Status = model.BookingPhotographerReqCancelStatus
	if err := r.BookingUsecase.BookingRepo.UpdateOne(c, booking); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"status": "failed",
			"error":  err.Error(),
		})
		c.Abort()
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"status": "success",
		"data":   booking,
	})
}
