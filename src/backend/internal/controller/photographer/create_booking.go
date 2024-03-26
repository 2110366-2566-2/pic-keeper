package photographer

import (
	"net/http"
	"time"

	"github.com/Roongkun/software-eng-ii/internal/controller/util"
	"github.com/Roongkun/software-eng-ii/internal/model"
	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
)

func (r *Resolver) CreateBooking(c *gin.Context) {
	photographer, ok := getPhotographer(c)
	if !ok {
		return
	}

	bookingProposal := model.BookingProposal{}
	if err := c.BindJSON(&bookingProposal); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"status":  "failed",
			"error":   err.Error(),
			"message": "unable to bind request body with json model, please recheck",
		})
		c.Abort()
		return
	}

	newBooking := &model.Booking{
		Id:         uuid.New(),
		CustomerId: photographer.Id,
		RoomId:     bookingProposal.RoomId,
		StartTime:  bookingProposal.StartTime,
		EndTime:    bookingProposal.EndTime,
		Status:     model.BookingDraftStatus,
		CreatedAt:  time.Now(),
		UpdatedAt:  time.Now(),
	}

	if err := r.RoomUsecase.PopulateRoomsInBookings(c, r.GalleryUsecase, newBooking); err != nil {
		util.Raise500Error(c, err)
		return
	}

	resultedPrice := newBooking.Room.Gallery.Price
	if bookingProposal.NegotiatedPrice != nil {
		resultedPrice = *bookingProposal.NegotiatedPrice
	}

	newBooking.ResultedPrice = resultedPrice

	if err := r.BookingUsecase.BookingRepo.AddOne(c, newBooking); err != nil {
		util.Raise500Error(c, err)
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"status": "success",
		"data":   newBooking,
	})
}
