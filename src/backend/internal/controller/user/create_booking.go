package user

import (
	"net/http"
	"time"

	"github.com/Roongkun/software-eng-ii/internal/model"
	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
)

func (r *Resolver) CreateBooking(c *gin.Context) {
	user, exists := c.Get("user")
	if !exists {
		c.JSON(http.StatusInternalServerError, gin.H{
			"status": "failed",
			"error":  "Failed to retrieve photographer from context",
		})
		c.Abort()
		return
	}

	userObj, ok := user.(model.User)
	if !ok {
		c.JSON(http.StatusInternalServerError, gin.H{
			"status": "failed",
			"error":  "Invalid object type in context",
		})
		c.Abort()
		return
	}

	bookingProposal := model.BookingProposal{}
	if err := c.BindJSON(&bookingProposal); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"status":  "failed",
			"error":   err.Error(),
			"message": "unable to bind request body with json model, please recheck",
		})
		c.Abort()
		return
	}

	newBooking := model.Booking{
		Id:         uuid.New(),
		CustomerId: userObj.Id,
		PackageId:  bookingProposal.PackageId,
		StartTime:  bookingProposal.StartTime,
		EndTime:    bookingProposal.EndTime,
		Status:     model.BookingPaidStatus,
		CreatedAt:  time.Now(),
		UpdatedAt:  time.Now(),
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
