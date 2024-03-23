package user

import (
	"net/http"

	"github.com/Roongkun/software-eng-ii/internal/controller/util"
	"github.com/Roongkun/software-eng-ii/internal/model"
	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
)

func (r *Resolver) RequestRefundBooking(c *gin.Context) {
	user, ok := getUser(c)
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

	if booking.CustomerId != user.Id {
		util.Raise403Error(c, "this is not your booking")
		return
	}
	if booking.Status != model.BookingCompletedStatus {
		util.Raise403Error(c, "this booking cannot be refunded")
		return
	}

	booking.Status = model.BookingRefundReqStatus
	if err := r.BookingUsecase.BookingRepo.UpdateOne(c, booking); err != nil {
		util.Raise500Error(c, err)
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"status": "success",
		"data":   booking,
	})
}
