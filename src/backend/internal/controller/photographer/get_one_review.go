package photographer

import (
	"net/http"

	"github.com/Roongkun/software-eng-ii/internal/controller/util"
	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
)

func (r *Resolver) GetOneReview(c *gin.Context) {
	photographer, ok := getPhotographer(c)
	if !ok {
		return
	}

	paramId := c.Param("id")
	reviewId := uuid.MustParse(paramId)

	review, err := r.ReviewUsecase.ReviewRepo.FindOneById(c, reviewId)
	if err != nil {
		util.Raise500Error(c, err)
		return
	}

	// check (not sure)
	// 1. check bookingId in this review
	booking, err := r.BookingUsecase.BookingRepo.FindOneById(c, review.BookingId)
	if err != nil {
		util.Raise500Error(c, err)
		return
	}

	// 2. check galleryId in the linked booking
	gallery, err := r.GalleryUsecase.GalleryRepo.FindOneById(c, booking.GalleryId)
	if err != nil {
		util.Raise500Error(c, err)
		return
	}

	// 3. check if the linked gallery belongs to this photographer
	if gallery.PhotographerId != photographer.Id {
		util.Raise403Error(c, "this review is not yours")
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"status": "success",
		"data":   review,
	})
}
