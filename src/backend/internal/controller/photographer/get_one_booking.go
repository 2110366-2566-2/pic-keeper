package photographer

import (
	"net/http"

	"github.com/Roongkun/software-eng-ii/internal/controller/util"
	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
)

func (r *Resolver) GetOneBooking(c *gin.Context) {
	photographer, ok := getPhotographer(c)
	if !ok {
		return
	}

	paramId := c.Param("id")
	bookingId := uuid.MustParse(paramId)

	booking, err := r.BookingUsecase.BookingRepo.FindOneById(c, bookingId)
	if err != nil {
		util.Raise500Error(c, err)
		return
	}

	if err := r.RoomUsecase.PopulateRoomsInBookings(c, r.GalleryUsecase, booking); err != nil {
		util.Raise500Error(c, err)
		return
	}

	if booking.Room.Gallery.PhotographerId != photographer.Id {
		util.Raise403Error(c, "this booking is not yours")
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"status": "success",
		"data":   booking,
	})
}
