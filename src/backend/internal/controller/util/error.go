package util

import (
	"net/http"

	"github.com/gin-gonic/gin"
)

func Raise500Error(c *gin.Context, err error) {
	c.JSON(http.StatusInternalServerError, gin.H{
		"status": "failed",
		"error":  err.Error(),
	})
	c.Abort()
}

func Raise400Error(c *gin.Context, message string) {
	c.JSON(http.StatusBadRequest, gin.H{
		"status": "failed",
		"error":  message,
	})
	c.Abort()
}

func Raise401Error(c *gin.Context, message string) {
	c.JSON(http.StatusUnauthorized, gin.H{
		"status": "failed",
		"error":  message,
	})
	c.Abort()
}

func Raise403Error(c *gin.Context, message string) {
	c.JSON(http.StatusForbidden, gin.H{
		"status": "failed",
		"error":  message,
	})
	c.Abort()
}

func Raise405Error(c *gin.Context, message string) {
	c.JSON(http.StatusMethodNotAllowed, gin.H{
		"status": "failed",
		"error":  message,
	})
	c.Abort()
}
