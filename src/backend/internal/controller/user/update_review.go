package user

import (
	"net/http"

	"github.com/Roongkun/software-eng-ii/internal/controller/user/fieldvalidate"
	"github.com/Roongkun/software-eng-ii/internal/controller/util"
	"github.com/Roongkun/software-eng-ii/internal/model"
	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
)

func (r *Resolver) UpdateReview(c *gin.Context) {
	user := c.MustGet("user")
	userObj, ok := user.(model.User)
	if !ok {
		c.JSON(http.StatusInternalServerError, gin.H{"status": "failed", "message": "Invalid user type in context"})
		c.Abort()
		return
	}

	updatingReviewInput := model.ReviewInput{}
	if err := c.BindJSON(&updatingReviewInput); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"status":  "failed",
			"error":   err.Error(),
			"message": "unable to bind request body with json model, please recheck",
		})
		c.Abort()
		return
	}

	if fieldErrs := fieldvalidate.UpdateReview(updatingReviewInput); len(fieldErrs) > 0 {
		c.JSON(http.StatusBadRequest, gin.H{
			"status": "failed",
			"error":  util.JSONErrs(fieldErrs),
		})
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
		util.Raise403Error(c, "You have no permission to edit this review")
		return
	}

	// editing
	updateReview(existingReview, updatingReviewInput)

	if err := r.ReviewUsecase.ReviewRepo.UpdateOne(c, existingReview); err != nil {
		util.Raise500Error(c, err)
		return
	}

	// do I need to populate customer and booking and gallery ??

	c.JSON(http.StatusOK, gin.H{
		"status": "success",
		"data":   existingReview,
	})
}

func updateReview(gallery *model.Review, input model.ReviewInput) {
	if input.Rating != nil {
		gallery.Rating = *input.Rating
	}
	if input.ReviewText != nil {
		gallery.ReviewText = *input.ReviewText
	}
}
