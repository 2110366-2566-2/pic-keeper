package user

import (
	"bytes"
	"fmt"
	"net/http"

	"github.com/Roongkun/software-eng-ii/internal/controller/util"
	"github.com/Roongkun/software-eng-ii/internal/model"
	"github.com/Roongkun/software-eng-ii/internal/third-party/s3utils"
	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
	"github.com/skip2/go-qrcode"
)

func (r *Resolver) GetQRCode(c *gin.Context) {
	user := c.MustGet("user")
	userObj, ok := user.(model.User)
	if !ok {
		util.Raise400Error(c, "could not bind json")
		return
	}

	paramId := c.Param("id")
	bookingId := uuid.MustParse(paramId)

	booking, err := r.BookingUsecase.BookingRepo.FindOneById(c, bookingId)
	if err != nil {
		util.Raise500Error(c, err)
		return
	}

	if booking.CustomerId != userObj.Id {
		util.Raise403Error(c, "this booking is not yours")
		return
	}

	if booking.Status != model.BookingDraftStatus {
		util.Raise403Error(c, "the booking is not in the draft status")
		return
	}

	png, err := qrcode.Encode(fmt.Sprintf("%s/%s", util.NgrokEndpoint, paramId), qrcode.Medium, 256)
	if err != nil {
		util.Raise500Error(c, err)
		return
	}

	s3basics, err := s3utils.GetInstance()
	if err != nil {
		util.Raise500Error(c, err)
		return
	}

	contentType := http.DetectContentType(png)
	buffer := bytes.NewBuffer(png)

	if err := s3basics.UploadFile(c, s3utils.QRPaymentBucket, paramId, buffer, contentType); err != nil {
		util.Raise500Error(c, err)
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"status": "success",
		"data":   util.GetPaymentQRCodeUrl(&paramId),
	})
}
