package photographer

import (
	"net/http"
	"time"

	"github.com/Roongkun/software-eng-ii/internal/model"
	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
)

func (r *Resolver) PurposeBooking(c *gin.Context) {
	photographer, exists := c.Get("photographer")
	if !exists {
		c.JSON(http.StatusInternalServerError, gin.H{
			"status": "failed",
			"error":  "Failed to retrieve photographer from context",
		})
		c.Abort()
		return
	}

	photographerObj, ok := photographer.(model.Photographer)
	if !ok {
		c.JSON(http.StatusInternalServerError, gin.H{
			"status": "failed",
			"error":  "Invalid object type in context",
		})
		c.Abort()
		return
	}

	bookingPurposal := model.BookingPurposal{}
	if err := c.BindJSON(&bookingPurposal); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"status":  "failed",
			"error":   err.Error(),
			"message": "unable to bind request body with json model, please recheck",
		})
		c.Abort()
		return
	}

	// dbvalidate
	existingPackage, err := r.PackageUsecase.PackageRepo.FindOneById(c, bookingPurposal.PackageId)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"status": "failed",
			"error":  err.Error(),
		})
		c.Abort()
		return
	}

	if existingPackage.PhotographerId != photographerObj.Id {
		c.JSON(http.StatusForbidden, gin.H{
			"status": "failed",
			"error":  "the package you have purposed is not yours",
		})
		c.Abort()
		return
	}

	newBooking := model.Booking{
		Id:         uuid.New(),
		CustomerId: bookingPurposal.CustomerId,
		PackageId:  bookingPurposal.PackageId,
		StartTime:  bookingPurposal.StartTime,
		EndTime:    bookingPurposal.EndTime,
		Status:     model.BookingPendingStatus,
		CreatedAt:  time.Now(),
		UpdatedAt:  time.Now(),
		DeletedAt:  nil,
	}

	if err := r.BookingUsecase.BookingRepo.AddOne(c, &newBooking); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"status": "failed",
			"error":  err.Error(),
		})
		c.Abort()
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"status": "success",
		"data":   newBooking,
	})
}
