package user

import (
	"net/http"

	"github.com/Roongkun/software-eng-ii/internal/controller/util"
	"github.com/Roongkun/software-eng-ii/internal/model"
	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
)

func (r *Resolver) DeleteReview(c *gin.Context) {
	user := c.MustGet("user")
	userObj, ok := user.(model.User)
	if !ok {
		c.JSON(http.StatusInternalServerError, gin.H{"status": "failed", "message": "Invalid user type in context"})
		c.Abort()
		return
	}

	paramId := c.Param("id")
	reviewId := uuid.MustParse(paramId)

	existingReview, err := r.ReviewUsecase.ReviewRepo.FindOneById(c, reviewId)
	if err != nil {
		util.Raise500Error(c, err)
		return
	}

	// dbValidate
	if userObj.Id != existingReview.CustomerId {
		util.Raise403Error(c, "You have no permission to delete this review")
		return
	}

	// deleting
	deletedId, err := r.ReviewUsecase.ReviewRepo.DeleteOneById(c, existingReview.Id)
	if err != nil {
		util.Raise500Error(c, err)
		return
	}

	if err := r.BookingUsecase.PopulateBookingInReviews(c, r.GalleryUsecase, r.RoomUsecase, existingReview); err != nil {
		util.Raise500Error(c, err)
		return
	}

	if err := UpdateGalleryRating(c, r.GalleryUsecase, r.ReviewUsecase, &existingReview.Booking.Room.Gallery); err != nil {
		util.Raise500Error(c, err)
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"status": "success",
		"data":   deletedId,
	})
}
