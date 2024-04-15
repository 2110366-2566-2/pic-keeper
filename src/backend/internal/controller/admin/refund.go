package admin

import (
	"net/http"

	"github.com/Roongkun/software-eng-ii/internal/controller/util"
	"github.com/Roongkun/software-eng-ii/internal/model"
	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
)

func (r *Resolver) RejectRefundBooking(c *gin.Context) {
	adminObj, ok := getAdmin(c)
	if !ok {
		return
	}

	if ok := checkIsAdmin(adminObj, c); !ok {
		return
	}

	paramId := c.Param("id")
	issueId := uuid.MustParse(paramId)

	issue, err := r.IssueUsecase.IssueRepo.FindOneById(c, issueId)
	if err != nil {
		util.Raise500Error(c, err)
		return
	}

	if issue.BookingId == nil || issue.Subject != model.IssueRefundSubject {
		util.Raise403Error(c, "this issue is not in the refund subject")
		return
	}

	if issue.Status != model.IssueOpenStatus {
		util.Raise403Error(c, "this issue is already closed")
		return
	}

	booking, err := r.BookingUsecase.BookingRepo.FindOneById(c, *issue.BookingId)
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

	issue.Status = model.IssueClosedStatus
	if err := r.IssueUsecase.IssueRepo.UpdateOne(c, issue); err != nil {
		util.Raise500Error(c, err)
		return
	}

	if err := r.RoomUsecase.PopulateRoomsInBookings(c, r.GalleryUsecase, booking); err != nil {
		util.Raise500Error(c, err)
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"status": "success",
		"data":   booking,
	})
}

func (r *Resolver) ApproveRefundBooking(c *gin.Context) {
	adminObj, ok := getAdmin(c)
	if !ok {
		return
	}

	if ok := checkIsAdmin(adminObj, c); !ok {
		return
	}

	paramId := c.Param("id")
	issueId := uuid.MustParse(paramId)

	issue, err := r.IssueUsecase.IssueRepo.FindOneById(c, issueId)
	if err != nil {
		util.Raise500Error(c, err)
		return
	}

	if issue.BookingId == nil || issue.Subject != model.IssueRefundSubject {
		util.Raise403Error(c, "this issue is not in the refund subject")
		return
	}

	if issue.Status != model.IssueOpenStatus {
		util.Raise403Error(c, "this issue is already closed")
		return
	}

	booking, err := r.BookingUsecase.BookingRepo.FindOneById(c, *issue.BookingId)
	if err != nil {
		util.Raise500Error(c, err)
		return
	}

	if booking.Status != model.BookingRefundReqStatus {
		util.Raise403Error(c, "the booking is not waiting for refund")
		return
	}

	booking.Status = model.BookingCancelledStatus
	if err := r.BookingUsecase.BookingRepo.UpdateOne(c, booking); err != nil {
		util.Raise500Error(c, err)
		return
	}

	issue.Status = model.IssueClosedStatus
	if err := r.IssueUsecase.IssueRepo.UpdateOne(c, issue); err != nil {
		util.Raise500Error(c, err)
		return
	}

	if err := r.RoomUsecase.PopulateRoomsInBookings(c, r.GalleryUsecase, booking); err != nil {
		util.Raise500Error(c, err)
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"status": "success",
		"data":   booking,
	})
}
