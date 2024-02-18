package model

import "github.com/gin-gonic/gin"

type JSONSuccessResult struct {
	Status string      `json:"status" example:"success"`
	Data   interface{} `json:"data"`
}

type JSONErrorResult struct {
	Status string      `json:"status" example:"failed"`
	Error  interface{} `json:"error"`
}

func SuccessResponse(c *gin.Context, status int, data any) {
	c.JSON(status, JSONSuccessResult{
		Status: "success",
		Data:   data,
	})
}

func FailedResponse(c *gin.Context, status int, error any) {
	c.JSON(status, JSONErrorResult{
		Status: "failed",
		Error:  error,
	})

	c.Abort()
}
