package admin

import (
	"net/http"

	"github.com/Roongkun/software-eng-ii/internal/controller/util"
	"github.com/gin-gonic/gin"
)

func (r *Resolver) ListPendingRefundBookings(c *gin.Context) {
	adminObj, ok := getAdmin(c)
	if !ok {
		return
	}

	if ok := checkIsAdmin(adminObj, c); !ok {
		return
	}

	pendingRefundBookings, err := r.BookingUsecase.ListPendingRefundBookings(c, r.GalleryUsecase, r.RoomUsecase)
	if err != nil {
		util.Raise500Error(c, err)
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"status": "success",
		"data":   pendingRefundBookings,
	})
}
