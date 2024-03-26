package photographer

import (
	"net/http"

	"github.com/gin-gonic/gin"
)

func (r *Resolver) ListReceivedReviews(c *gin.Context) {
	photographer, ok := getPhotographer(c)
	if !ok {
		return
	}

	reviews, err := r.ReviewUsecase.FindByPhotographerId(c, photographer.Id, r.UserUsecase, r.BookingUsecase)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"status": "failed",
			"error":  err.Error(),
		})
		c.Abort()
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"status": "success",
		"data":   reviews,
	})
}
