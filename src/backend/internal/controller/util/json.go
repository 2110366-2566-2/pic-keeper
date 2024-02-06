package util

import (
	"encoding/json"

	"github.com/gin-gonic/gin"
)

type JSONErrs []error

func (je JSONErrs) MarshalJSON() ([]byte, error) {
	res := make([]interface{}, len(je))
	for i, e := range je {
		if _, ok := e.(json.Marshaler); ok {
			res[i] = e // e knows how to marshal itself
		} else {
			res[i] = e.Error() // Fallback to the error string
		}
	}
	return json.Marshal(res)
}

func ReturnErr(message string, err error) any {
	return gin.H{
		"message": message,
		"error":   err.Error(),
	}
}
