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

func TestInvalidUserModel(t *testing.T) {
	w := httptest.NewRecorder()
	updateField := []byte(`""`)
	updateReader := bytes.NewReader(updateField)

	invalid := r.Group("/invalid", func(c *gin.Context) {
		c.Set("user", "")
	})
	invalid.PUT("/updateUserProfile", resolver.UpdateUserProfile)

	req, _ := http.NewRequest(http.MethodPut, "/invalid/updateUserProfile", updateReader)
	r.ServeHTTP(w, req)
	response, _ := io.ReadAll(w.Body)

	errResp := ErrorResponse{}
	json.Unmarshal(response, &errResp)

	assert.Equal(t, 500, w.Code)
	assert.Equal(t, "failed", errResp.Status)
	assert.Equal(t, "invalid user type in context", errResp.Error)
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

func TestUpdateExistedUsername(t *testing.T) {
	w := httptest.NewRecorder()
	updateField := []byte(`{"username": "existed"}`)
	updateReader := bytes.NewReader(updateField)
	req, _ := http.NewRequest(http.MethodPut, "/updateUserProfile", updateReader)

	r.ServeHTTP(w, req)
	response, _ := io.ReadAll(w.Body)

	errResp := ErrorResponse{}
	json.Unmarshal(response, &errResp)

	assert.Equal(t, 409, w.Code)
	assert.Equal(t, "failed", errResp.Status)
	assert.Equal(t, errResp.Error, "username already exist")
}

func TestUpdateExistedEmail(t *testing.T) {
	w := httptest.NewRecorder()
	updateField := []byte(`{"email": "exist@mail.com"}`)
	updateReader := bytes.NewReader(updateField)
	req, _ := http.NewRequest(http.MethodPut, "/updateUserProfile", updateReader)

	r.ServeHTTP(w, req)
	response, _ := io.ReadAll(w.Body)

	errResp := ErrorResponse{}
	json.Unmarshal(response, &errResp)

	assert.Equal(t, 500, w.Code)
	assert.Equal(t, "failed", errResp.Status)
}

func TestUpdateInvalidGender(t *testing.T) {
	w := httptest.NewRecorder()
	updateField := []byte(`{"gender": "NONE"}`)
	updateReader := bytes.NewReader(updateField)
	req, _ := http.NewRequest(http.MethodPut, "/updateUserProfile", updateReader)

	r.ServeHTTP(w, req)
	response, _ := io.ReadAll(w.Body)

	fieldErrResp := FieldErrorResponse{}
	json.Unmarshal(response, &fieldErrResp)

	assert.Equal(t, 400, w.Code)
	assert.Equal(t, "failed", fieldErrResp.Status)
	assert.Contains(t, fieldErrResp.Error, "gender must be MALE, FEMALE, or OTHER")
}

func TestUpdateTooLongPassword(t *testing.T) {
	w := httptest.NewRecorder()
	updateField := []byte(`{"password": "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa"}`)
	updateReader := bytes.NewReader(updateField)
	req, _ := http.NewRequest(http.MethodPut, "/updateUserProfile", updateReader)

	r.ServeHTTP(w, req)
	response, _ := io.ReadAll(w.Body)

	errResp := ErrorResponse{}
	json.Unmarshal(response, &errResp)

	assert.Equal(t, 500, w.Code)
	assert.Equal(t, "failed", errResp.Status)
}

func TestUpdateUserProfile(t *testing.T) {
	w := httptest.NewRecorder()
	updateField := []byte(`{"email": "pass@mail.com", "about": "nothing", "password": "secure", "phone_number": "0855555555", "firstname": "test", "lastname": "test", "gender": "MALE", "address": "nothing", "username": "new"}`)
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
