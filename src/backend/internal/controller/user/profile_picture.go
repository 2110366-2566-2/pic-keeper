package user

import (
	"crypto/sha256"
	"fmt"
	"net/http"

	"github.com/Roongkun/software-eng-ii/internal/controller/util"
	"github.com/Roongkun/software-eng-ii/internal/model"
	"github.com/Roongkun/software-eng-ii/internal/third-party/s3utils"
	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
)

func hashEmail(email string) string {
	hasher := sha256.New()
	hasher.Write([]byte(email))
	return fmt.Sprintf("%x", hasher.Sum(nil))
}

// UploadProfilePicture handles the HTTP request for uploading a profile picture.
//
// @Summary      Upload profile picture
// @Description  Upload profile picture
// @Tags         users
// @Param Token header string true "Session token is required"
// @Param ProfilePicture formData file true "The profile picture file is required"
// @Accept       json
// @Produce      json
// @Success      200 {object} model.JSONSuccessResult{status=string,data=nil} "Successfully uploaded the profile picture"
// @Failure 400 {object} model.JSONErrorResult{status=string,error=nil} "Incorrect input"
// @Failure 500 {object} model.JSONErrorResult{status=string,error=nil} "Unhandled internal server error"
// @Router /users/v1/upload-profile [post]
func (r *Resolver) UploadProfilePicture(c *gin.Context) {

	fmt.Println(c.Request)
	file, _, err := c.Request.FormFile("profilePicture")

	fmt.Println(file)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"status": "failed", "error": "Could not retrieve the file"})
		c.Abort()
		return
	}
	defer file.Close()

	buf, contentType, err := util.FormatImage(file)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"status": "failed", "error": err.Error()})
		c.Abort()
		return
	}

	email, exists := c.Get("email")
	if !exists {
		c.JSON(http.StatusInternalServerError, gin.H{"status": "failed", "error": "Failed to retrieve user email from context"})
		c.Abort()
		return
	}

	// Generate a UUID for the file
	fileUUID := uuid.New().String()
	objectKey := fmt.Sprintf("%s-%s", hashEmail(email.(string)), fileUUID)

	bucket, err := s3utils.GetInstance()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"status": "failed", "error": err.Error()})
		c.Abort()
		return
	}
	if err := bucket.UploadFile(c.Request.Context(), s3utils.ProfilePicBucket, objectKey, buf, contentType); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"status": "failed", "error": "Failed to upload the file"})
		c.Abort()
		return
	}

	user, exists := c.Get("user")
	if !exists {
		c.JSON(http.StatusInternalServerError, gin.H{"status": "failed", "error": "Failed to retrieve user from context"})
		c.Abort()
		return
	}
	userObj, ok := user.(model.User)
	if !ok {
		c.JSON(http.StatusInternalServerError, gin.H{"status": "failed", "error": "Invalid user type in context"})
		c.Abort()
		return
	}

	userObj.ProfilePictureKey = &objectKey
	if err := r.UserUsecase.UserRepo.UpdateOne(c, &userObj); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"status": "failed",
			"error":  err.Error(),
		})
		c.Abort()
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"status":              "success",
		"message":             "Profile picture uploaded successfully",
		"profile_picture_url": fmt.Sprintf("http://localhost:4566/%s/%s", "profile-picture", objectKey),
	})
}
