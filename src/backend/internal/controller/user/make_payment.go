package user

import (
	"net/http"

	"github.com/Roongkun/software-eng-ii/internal/controller/util"
	"github.com/Roongkun/software-eng-ii/internal/model"
	"github.com/Roongkun/software-eng-ii/internal/third-party/s3utils"
	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
)

func (r *Resolver) MakeBookingPayment(c *gin.Context) {
	paramId := c.Param("bookingId")
	bookingId := uuid.MustParse(paramId)

	booking, err := r.BookingUsecase.BookingRepo.FindOneById(c, bookingId)
	if err != nil {
		util.Raise500Error(c, err)
		return
	}

	booking.Status = model.BookingPaidStatus
	if err := r.BookingUsecase.BookingRepo.UpdateOne(c, booking); err != nil {
		util.Raise500Error(c, err)
		return
	}

	s3basics, err := s3utils.GetInstance()
	if err != nil {
		util.Raise500Error(c, err)
		return
	}

	if err := s3basics.DeleteFile(c, s3utils.QRPaymentBucket, paramId); err != nil {
		util.Raise500Error(c, err)
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"status": "success",
		"data":   booking,
	})
}
