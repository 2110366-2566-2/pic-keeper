package photographer

import (
	"net/http"

	"github.com/Roongkun/software-eng-ii/internal/controller/util"
	"github.com/Roongkun/software-eng-ii/internal/model"
	"github.com/gin-gonic/gin"
)

func (r *Resolver) ListPastBookings(c *gin.Context) {
	photographer, ok := getPhotographer(c)
	if !ok {
		return
	}

	acceptedStatus := []string{model.BookingCompletedStatus, model.BookingPaidOutStatus}
	bookings, err := r.BookingUsecase.FindByPhotographerIdWithStatus(c, photographer.Id, r.GalleryUsecase, r.RoomUsecase, acceptedStatus...)
	if err != nil {
		util.Raise500Error(c, err)
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"status": "success",
		"data":   bookings,
	})
}
