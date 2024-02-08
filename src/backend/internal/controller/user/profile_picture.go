package user 

import 	{

	"crypto/sha256"
	"fmt"
	"net/http"
	"path/filepath"
	"bytes"
	"image"
	"image/jpeg"
	"image/png"
	"net/http"
	"strings"

	"github.com/gin-gonic/gin"
	"github.com/aws/aws-sdk-go-v2/service/s3"
	"github.com/Roongkun/software-eng-ii/internal/third-party/aws"
}

func hashEmail(email string) string {
    hasher := sha256.New()
    hasher.Write([]byte(email))
    return fmt.Sprintf("%x", hasher.Sum(nil))
}

func (r *Resolver) UploadProfilePicture(c *gin.Context) {
	// Retrieve the file from the multipart form
	file, header, err := c.Request.FormFile("profilePicture")
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Could not retrieve the file"})
		return
	}
	defer file.Close()

	ext := strings.ToLower(filepath.Ext(header.Filename))
	if ext != ".jpg" && ext != ".jpeg" && ext != ".png" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "File format not supported"})
		return
	}

	// Decode the image
	var img image.Image
	if ext == ".jpg" || ext == ".jpeg" {
		img, err = jpeg.Decode(file)
		if err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Error decoding JPEG image"})
			return
		}
	} else if ext == ".png" {
		img, err = png.Decode(file)
		if err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Error decoding PNG image"})
			return
		}
	}

	// Resize the image
	maxWidth := uint(800) // Adjust to whatever size you need
	maxHeight := uint(600)
	img = resize.Thumbnail(maxWidth, maxHeight, img, resize.Lanczos3)

	// Compress the image and get it ready for upload
	var buf bytes.Buffer
	if ext == ".jpg" || ext == ".jpeg" {
		err = jpeg.Encode(&buf, img, &jpeg.Options{Quality: 75}) // Adjust quality level
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Error compressing JPEG image"})
			return
		}
	} else if ext == ".png" {
		err = png.Encode(&buf, img)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Error compressing PNG image"})
			return
		}
	}

	// Get the email from the Gin context and hash it
	email, _ := c.Get("email") // Add error checking
	objectKey := fmt.Sprintf("profile-pictures/%s%s", hashEmail(email.(string)), ext)

	// Upload the image to S3
	bucketBasics, _ := NewBucketBasics() // Add error checking
	err = bucketBasics.UploadFile("profile-picture", objectKey, &buf)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to upload the file"})
		return
	}

	// Respond with success and the location of the uploaded picture
	c.JSON(http.StatusOK, gin.H{
		"message":     "Profile picture uploaded successfully",
		"picture_url": fmt.Sprintf("https://%s.s3.amazonaws.com/%s", "profile-picture", objectKey),
	})
}