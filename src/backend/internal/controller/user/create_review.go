package user

import (
	"net/http"

	"github.com/Roongkun/software-eng-ii/internal/controller/user/fieldvalidate"
	"github.com/Roongkun/software-eng-ii/internal/controller/util"
	"github.com/Roongkun/software-eng-ii/internal/model"
	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
)

func (r *Resolver) CreateReview(c *gin.Context) {
	user := c.MustGet("user")
	userObj, ok := user.(model.User)
	if !ok {
		c.JSON(http.StatusInternalServerError, gin.H{"status": "failed", "message": "Invalid user type in context"})
		c.Abort()
		return
	}

	reviewInput := model.ReviewInput{}
	if err := c.BindJSON(&reviewInput); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"status":  "failed",
			"error":   err.Error(),
			"message": "unable to bind request body with json model, please recheck",
		})
		c.Abort()
		return
	}

	if fieldErrs := fieldvalidate.CreateReview(reviewInput); len(fieldErrs) > 0 {
		c.JSON(http.StatusBadRequest, gin.H{
			"status": "failed",
			"error":  util.JSONErrs(fieldErrs),
		})
		c.Abort()
		return
	}

	newReview := &model.Review{
		Id:         uuid.New(),
		CustomerId: userObj.Id,
		BookingId:  *reviewInput.BookingId,
		Rating:     *reviewInput.Rating,
		ReviewText: reviewInput.ReviewText,
	}

	if err := r.ReviewUsecase.ReviewRepo.AddOne(c, newReview); err != nil {
		util.Raise500Error(c, err)
		return
	}

	if err := r.BookingUsecase.PopulateBookingInReviews(c, r.GalleryUsecase, r.RoomUsecase, newReview); err != nil {
		util.Raise500Error(c, err)
		return
	}

	if err := r.UserUsecase.PopulateCustomerInReviews(c, newReview); err != nil {
		util.Raise500Error(c, err)
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"status": "success",
		"data":   newReview,
	})
}
