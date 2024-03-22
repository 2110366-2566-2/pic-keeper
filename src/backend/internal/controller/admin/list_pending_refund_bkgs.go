package admin

import (
	"github.com/Roongkun/software-eng-ii/internal/controller/util"
	"github.com/Roongkun/software-eng-ii/internal/model"
	"github.com/gin-gonic/gin"
)

func (r *Resolver) ListPendingRefundBookings(c *gin.Context) {
	admin := c.MustGet("user")
	adminObj, ok := admin.(model.User)
	if !ok {
		util.Raise400Error(c, "could not bind json")
		return
	}

	if !adminObj.IsAdmin {
		util.Raise401Error(c, "only administrators are allowed to list pending refund bookings")
		return
	}

	pendingRefundBookings, err := r.BookingUsecase.ListPendingRefundBookings(c)
	if err != nil {
		util.Raise500Error(c, err)
		return
	}
}
