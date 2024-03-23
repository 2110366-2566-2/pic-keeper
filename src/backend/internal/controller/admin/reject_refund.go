package admin

import (
	"net/http"

	"github.com/Roongkun/software-eng-ii/internal/controller/util"
	"github.com/Roongkun/software-eng-ii/internal/model"
	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
)

func (r *Resolver) RejectRefundBooking(c *gin.Context) {
	admin := c.MustGet("user")
	adminObj, ok := admin.(model.User)
	if !ok {
		util.Raise400Error(c, "could not bind json")
		return
	}

	if ok := checkIsAdmin(adminObj, c); !ok {
		return
	}

	paramId := c.Param("id")
	bookingId := uuid.MustParse(paramId)

	booking, err := r.BookingUsecase.BookingRepo.FindOneById(c, bookingId)
	if err != nil {
		util.Raise500Error(c, err)
		return
	}

	if booking.Status != model.BookingRefundReqStatus {
		util.Raise403Error(c, "the booking is not waiting for refund")
		return
	}

	booking.Status = model.BookingPaidStatus
	if err := r.BookingUsecase.BookingRepo.UpdateOne(c, booking); err != nil {
		util.Raise500Error(c, err)
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"status": "success",
		"data":   booking,
	})
}
