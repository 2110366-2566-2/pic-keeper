package user

import (
	"net/http"
	"time"

	"github.com/Roongkun/software-eng-ii/internal/controller/util"
	"github.com/Roongkun/software-eng-ii/internal/model"
	"github.com/Roongkun/software-eng-ii/internal/usecase"
	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
)

func (r *Resolver) RequestRefundBooking(c *gin.Context) {
	user, ok := GetUser(c)
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

	newIssue := &model.Issue{
		Id:          uuid.New(),
		Subject:     model.IssueRefundSubject,
		CreatedAt:   time.Now(),
		DueDate:     booking.EndTime.Add(3 * 24 * time.Hour),
		Status:      model.IssueOpenStatus,
		ReporterId:  user.Id,
		Description: bookingId.String(),
	}

	if err := r.IssueUsecase.IssueRepo.AddOne(c, newIssue); err != nil {
		util.Raise500Error(c, err)
		return
	}

	if err := usecase.PopulateRoomsInBookings(c, r.RoomUsecase, r.GalleryUsecase, booking); err != nil {
		util.Raise500Error(c, err)
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"status": "success",
		"data":   booking,
	})
}
