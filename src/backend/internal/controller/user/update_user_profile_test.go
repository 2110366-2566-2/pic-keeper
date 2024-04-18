package user

import (
	"bytes"
	"context"
	"encoding/json"
	"io"
	"net/http"
	"net/http/httptest"
	"os"
	"testing"

	"github.com/Roongkun/software-eng-ii/internal/model"
	"github.com/Roongkun/software-eng-ii/internal/third-party/databases"
	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
	"github.com/stretchr/testify/assert"
)

type FieldErrorResponse struct {
	Error  []string `json:"error"`
	Status string   `json:"status"`
}

type ErrorResponse struct {
	Error  string `json:"error"`
	Status string `json:"status"`
}

type SuccessResponse struct {
	Data   model.User `json:"data"`
	Status string     `json:"status"`
}

var (
	r        *gin.Engine
	resolver *Resolver
	mockUser = &model.User{
		Id:                 uuid.New(),
		Username:           uuid.New().String(),
		Email:              "mock@mail.com",
		Password:           nil,
		Provider:           nil,
		LoggedOut:          false,
		ProfilePictureKey:  nil,
		Firstname:          "mock",
		Lastname:           "mock",
		VerificationStatus: model.PhotographerNotVerifiedStatus,
		Address:            nil,
		PhoneNumber:        nil,
		Gender:             nil,
		About:              nil,
	}
)

func init() {
	db := databases.ConnectSQLDB(os.Getenv("dsn"))
	resolver = NewResolver(db)
	resolver.UserUsecase.UserRepo.AddOne(context.Background(), mockUser)

	gin.SetMode(gin.ReleaseMode)
	r = gin.Default()
	r.Use(func(c *gin.Context) {
		c.Set("user", *mockUser)
	})
	r.PUT("/updateUserProfile", resolver.UpdateUserProfile)
}

func TestInvalidJSON(t *testing.T) {
	w := httptest.NewRecorder()
	updateField := []byte(`"email": null`)
	updateReader := bytes.NewReader(updateField)

	req, _ := http.NewRequest(http.MethodPut, "/updateUserProfile", updateReader)

	r.ServeHTTP(w, req)
	response, _ := io.ReadAll(w.Body)

	errResp := ErrorResponse{}
	json.Unmarshal(response, &errResp)

	assert.Equal(t, 400, w.Code)
	assert.Equal(t, "failed", errResp.Status)
	assert.Equal(t, "unable to bind request body with json model, please recheck", errResp.Error)
}

func TestNotChanged(t *testing.T) {
	w := httptest.NewRecorder()
	updateField := []byte(`{"email": null}`)
	updateReader := bytes.NewReader(updateField)

	req, _ := http.NewRequest(http.MethodPut, "/updateUserProfile", updateReader)

	r.ServeHTTP(w, req)
	response, _ := io.ReadAll(w.Body)

	fieldErrResp := FieldErrorResponse{}
	json.Unmarshal(response, &fieldErrResp)

	assert.Equal(t, 400, w.Code)
	assert.Equal(t, "failed", fieldErrResp.Status)
	assert.Contains(t, fieldErrResp.Error, "one of the update fields must be changed")
}

func TestUpdateInvalidEmail(t *testing.T) {
	w := httptest.NewRecorder()
	updateField := []byte(`{"email": "invalid"}`)
	updateReader := bytes.NewReader(updateField)
	req, _ := http.NewRequest(http.MethodPut, "/updateUserProfile", updateReader)

	r.ServeHTTP(w, req)
	response, _ := io.ReadAll(w.Body)

	fieldErrResp := FieldErrorResponse{}
	json.Unmarshal(response, &fieldErrResp)

	assert.Equal(t, 400, w.Code)
	assert.Equal(t, "failed", fieldErrResp.Status)
	assert.Contains(t, fieldErrResp.Error, "invalid email format")
}

func TestUpdateUserProfile(t *testing.T) {
	w := httptest.NewRecorder()
	updateField := []byte(`{"email": "hi@mail.com"}`)
	updateReader := bytes.NewReader(updateField)
	req, _ := http.NewRequest(http.MethodPut, "/updateUserProfile", updateReader)

	r.ServeHTTP(w, req)
	response, _ := io.ReadAll(w.Body)

	successResp := SuccessResponse{}
	json.Unmarshal(response, &successResp)

	defer resolver.UserUsecase.UserRepo.DeleteOneById(context.Background(), mockUser.Id)
	assert.Equal(t, 200, w.Code)
	assert.Equal(t, "success", successResp.Status)
	assert.NotNil(t, successResp.Data)
}
