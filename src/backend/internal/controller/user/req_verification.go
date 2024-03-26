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

func hashIdCardNumber(idCardNumber string) string {
	hasher := sha256.New()
	hasher.Write([]byte(idCardNumber))
	return fmt.Sprintf("%x", hasher.Sum(nil))
}

func (r *Resolver) RequestVerification(c *gin.Context) {
	user, ok := GetUser(c)
	if !ok {
		return
	}

	if user.VerificationStatus != model.PhotographerNotVerifiedStatus && user.VerificationStatus != model.PhotographerRejectedStatus {
		c.JSON(http.StatusForbidden, gin.H{
			"status": "failed",
			"error":  "cannot request further verification with your current status",
		})
		c.Abort()
		return
	}

	verificationInfoInput := model.VerificationInformationInput{}
	if err := c.Bind(&verificationInfoInput); err != nil {
		util.Raise500Error(c, err)
		return
	}

	idCardPictureFile, err := verificationInfoInput.IdCardPicture.Open()
	if err != nil {
		util.Raise500Error(c, err)
		return
	}

	defer idCardPictureFile.Close()

	buf, contentType, err := util.FormatImage(idCardPictureFile)
	if err != nil {
		util.Raise500Error(c, err)
		return
	}

	objectKey := fmt.Sprintf("%s-%s", hashIdCardNumber(verificationInfoInput.IdCardNumber), uuid.New().String())

	bucket, err := s3utils.GetInstance()
	if err != nil {
		util.Raise500Error(c, err)
		return
	}

	if err := bucket.UploadFile(c, s3utils.IdCardBucket, objectKey, buf, contentType); err != nil {
		util.Raise500Error(c, err)
		return
	}

	newVerificationInfo := &model.VerificationInformation{
		Id:                    uuid.New(),
		UserId:                user.Id,
		IdCardNumber:          verificationInfoInput.IdCardNumber,
		IdCardPictureKey:      objectKey,
		AdditionalDescription: verificationInfoInput.AdditionalDescription,
	}

	user.VerificationStatus = model.PhotographerPendingStatus
	if err := r.UserUsecase.UserRepo.UpdateOne(c, user); err != nil {
		util.Raise500Error(c, err)
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"status": "success",
		"data":   user,
	})
}
