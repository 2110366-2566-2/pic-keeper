package admin

import (
	"net/http"

	"github.com/Roongkun/software-eng-ii/internal/controller/util"
	"github.com/Roongkun/software-eng-ii/internal/model"
	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
)

func (r *Resolver) GetIssuesWithOption(c *gin.Context) {
	admin, ok := getAdmin(c)
	if !ok {
		return
	}
	if ok := checkIsAdmin(admin, c); !ok {
		return
	}

	issueFilter := model.IssueFilter{}
	if err := c.BindQuery(&issueFilter); err != nil {
		util.Raise500Error(c, err)
		return
	}

	issues, err := r.IssueUsecase.FindIssuesWithFilter(c, issueFilter)
	if err != nil {
		util.Raise500Error(c, err)
		return
	}

	userIdsToIssue := map[uuid.UUID][]*model.Issue{}
	userIds := []uuid.UUID{}
	for _, issue := range issues {
		if _, exist := userIdsToIssue[issue.ReporterId]; !exist {
			userIds = append(userIds, issue.ReporterId)
		}
		userIdsToIssue[issue.ReporterId] = append(userIdsToIssue[issue.ReporterId], issue)
	}

	users, err := r.UserUsecase.UserRepo.FindByIds(c, userIds...)
	if err != nil {
		util.Raise500Error(c, err)
		return
	}
	for _, user := range users {
		for _, issue := range userIdsToIssue[user.Id] {
			issue.Reporter = *user
		}
	}

	bookingIdsToIssue := map[uuid.UUID][]*model.Issue{}
	bookingIds := []uuid.UUID{}

	for _, issue := range issues {
		if issue.BookingId != nil {
			if _, exist := bookingIdsToIssue[*issue.BookingId]; !exist {
				bookingIds = append(bookingIds, *issue.BookingId)
			}
			bookingIdsToIssue[*issue.BookingId] = append(bookingIdsToIssue[*issue.BookingId], issue)
		}
	}

	bookings, err := r.BookingUsecase.BookingRepo.FindByIds(c, bookingIds...)
	if err != nil {
		util.Raise500Error(c, err)
		return
	}
	for _, booking := range bookings {
		for _, issue := range bookingIdsToIssue[booking.Id] {
			issue.Booking = booking
		}
	}

	c.JSON(http.StatusOK, gin.H{
		"status": "success",
		"data":   issues,
	})
}

func (r *Resolver) GetIssueHeaderMetadata(c *gin.Context) {
	admin, ok := getAdmin(c)
	if !ok {
		return
	}
	if ok := checkIsAdmin(admin, c); !ok {
		return
	}

	issueHeaderMetadata, err := r.IssueUsecase.GetIssueHeaderMetadata(c)
	if err != nil {
		util.Raise500Error(c, err)
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"status": "success",
		"data":   issueHeaderMetadata,
	})
}
