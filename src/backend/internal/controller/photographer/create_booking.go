package photographer

import (
	"net/http"
	"time"

	"github.com/Roongkun/software-eng-ii/internal/controller/user"
	"github.com/Roongkun/software-eng-ii/internal/controller/util"
	"github.com/Roongkun/software-eng-ii/internal/model"
	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
)

func (r *Resolver) CreateBooking(c *gin.Context) {
	userObj, ok := user.GetUser(c)
	if !ok {
		return
	}

	bookingProposal := model.BookingProposal{}
	if err := c.BindJSON(&bookingProposal); err != nil {
		util.Raise500Error(c, err)
		return
	}

	newBooking := model.Booking{
		Id:         uuid.New(),
		CustomerId: userObj.Id,
		RoomId:     bookingProposal.RoomId,
		GalleryId:  bookingProposal.GalleryId,
		StartTime:  bookingProposal.StartTime,
		EndTime:    bookingProposal.EndTime,
		Status:     model.BookingDraftStatus,
		CreatedAt:  time.Now(),
		UpdatedAt:  time.Now(),
	}

	if err := r.BookingUsecase.BookingRepo.AddOne(c, &newBooking); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"status": "failed",
			"error":  err.Error(),
		})
		c.Abort()
		return
	}

	gallery, err := r.GalleryUsecase.GalleryRepo.FindOneById(c, bookingProposal.GalleryId)
	if err != nil {
		util.Raise500Error(c, err)
		return
	}
	room, err := r.RoomUsecase.RoomRepo.FindOneById(c, bookingProposal.RoomId)
	if err != nil {
		util.Raise500Error(c, err)
		return
	}

	newBooking.Gallery = *gallery
	newBooking.Room = *room

	c.JSON(http.StatusOK, gin.H{
		"status": "success",
		"data":   newBooking,
	})
}
