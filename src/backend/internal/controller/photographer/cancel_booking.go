package photographer

import (
	"net/http"

	"github.com/Roongkun/software-eng-ii/internal/controller/util"
	"github.com/Roongkun/software-eng-ii/internal/model"
	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
)

func (r *Resolver) CancelBooking(c *gin.Context) {
	photographer, ok := getPhotographer(c)
	if !ok {
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

	if err := r.RoomUsecase.PopulateRoomsInBookings(c, r.GalleryUsecase, booking); err != nil {
		util.Raise500Error(c, err)
		return
	}

	if booking.Room.Gallery.PhotographerId != photographer.Id {
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
