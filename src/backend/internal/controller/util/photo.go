package util

import (
	"bytes"
	"fmt"
	"image"
	"image/jpeg"
	"image/png"
	"io"
	"mime/multipart"
	"net/http"

	"github.com/Roongkun/software-eng-ii/internal/third-party/s3utils"
	"github.com/nfnt/resize"
)

func validateImage(file io.ReadSeeker) (string, error) {
	buffer := make([]byte, 512)
	_, err := file.Read(buffer)
	if err != nil {
		return "", fmt.Errorf("failed to read file header: %w", err)
	}
	// Seek to the start of the file after reading the header
	if _, err := file.Seek(0, io.SeekStart); err != nil {
		return "", fmt.Errorf("failed to reset file read pointer: %w", err)
	}
	contentType := http.DetectContentType(buffer)
	return contentType, nil
}

func decodeImage(contentType string, file io.Reader) (image.Image, error) {
	var img image.Image
	var err error
	switch contentType {
	case "image/jpeg":
		img, err = jpeg.Decode(file)
	case "image/png":
		img, err = png.Decode(file)
	default:
		return nil, fmt.Errorf("unsupported content type: %s", contentType)
	}
	if err != nil {
		return nil, fmt.Errorf("error decoding image: %w", err)
	}

	return img, nil
}

// processImage resizes and compresses the image.
func processImage(img image.Image, contentType string) (*bytes.Buffer, error) {
	maxWidth, maxHeight := uint(800), uint(600)
	img = resize.Thumbnail(maxWidth, maxHeight, img, resize.Lanczos3)

	var buf bytes.Buffer
	switch contentType {
	case "image/jpeg":
		err := jpeg.Encode(&buf, img, &jpeg.Options{Quality: 75})
		if err != nil {
			return nil, fmt.Errorf("error compressing JPEG image: %w", err)
		}
	case "image/png":
		err := png.Encode(&buf, img)
		if err != nil {
			return nil, fmt.Errorf("error compressing PNG image: %w", err)
		}
	}

	return &buf, nil
}

func FormatImage(file multipart.File) (*bytes.Buffer, string, error) {
	contentType, err := validateImage(file)
	if err != nil {
		return nil, "", err
	}

	img, err := decodeImage(contentType, file)
	if err != nil {
		return nil, "", err
	}

	buf, err := processImage(img, contentType)
	if err != nil {
		return nil, "", err
	}

	return buf, contentType, nil
}

const baseUrl = "http://localhost:4566"

func GetProfilePictureUrl(profilePictureKey *string) string {
	if profilePictureKey == nil {
		return ""
	}
	// TODO: Add aws endpoint to config
	url := fmt.Sprintf("%s/%s/%s", baseUrl, s3utils.ProfilePicBucket, *profilePictureKey)
	return url
}

func GetPaymentQRCodeUrl(qrPaymentKey *string) string {
	if qrPaymentKey == nil {
		return ""
	}

	return fmt.Sprintf("%s/%s/%s", baseUrl, s3utils.QRPaymentBucket, *qrPaymentKey)
}

func GetGalleryPictureUrl(galleryPictureKey *string) string {
	if galleryPictureKey == nil {
		return ""
	}

	url := fmt.Sprintf("%s/%s/%s", baseUrl, s3utils.GalleryPhotoBucket, *galleryPictureKey)
	return url
}
