package model

type JSONSuccessResult struct {
	Status string      `json:"status" example:"success"`
	Data   interface{} `json:"data"`
}

type JSONErrorResult struct {
	Status string      `json:"status" example:"failed"`
	Error  interface{} `json:"error"`
}
