package admin

import (
	"fmt"
	"net/http"

	"github.com/Roongkun/software-eng-ii/internal/controller/util"
	"github.com/Roongkun/software-eng-ii/internal/model"
	"github.com/Roongkun/software-eng-ii/internal/third-party/s3utils"
	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
)

// @Summary      List all unverified photographers
// @Description List all unverified photographers
// @Tags         admin
// @Param Token header string true "Session token is required"
// @Accept       json
// @Produce      json
// @Success      200 {object} model.JSONSuccessResult{status=string,data=nil} "List of unverified photographers will be located inside the data field"
// @Failure 404 {object} model.JSONErrorResult{status=string,error=nil} "Administrator is no longer existed"
// @Failure 500 {object} model.JSONErrorResult{status=string,error=nil} "Unhandled internal server error OR session token cannot be verified"
//
// @Router       /admin/v1/verifications/pending-photographers [get]
func (r *Resolver) ListPendingPhotographers(c *gin.Context) {
	adminObj, ok := getAdmin(c)
	if !ok {
		return
	}

	if ok := checkIsAdmin(adminObj, c); !ok {
		return
	}

	pendingPhotographers, err := r.UserUsecase.ListPendingPhotographers(c)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"status": "failed",
			"error":  err.Error,
		})
		c.Abort()
		return
	}

	pendingPhtgIds := []uuid.UUID{}
	phtgIdsToPhtgEntities := map[uuid.UUID]*model.User{}

	for _, pendingPhtg := range pendingPhotographers {
		pendingPhtgIds = append(pendingPhtgIds, pendingPhtg.Id)
		phtgIdsToPhtgEntities[pendingPhtg.Id] = pendingPhtg
	}

	verificationTickets, err := r.VerificationTicketUsecase.FindByUserIds(c, pendingPhtgIds)
	if err != nil {
		util.Raise500Error(c, err)
		return
	}

	for _, vrfTicket := range verificationTickets {
		vrfTicket.User = *phtgIdsToPhtgEntities[vrfTicket.UserId]
		vrfTicket.IdCardPictureURL = fmt.Sprintf("http://localhost:4566/%s/%s", s3utils.IdCardBucket, vrfTicket.IdCardPictureKey)
	}

	c.JSON(http.StatusOK, gin.H{
		"status": "success",
		"data":   verificationTickets,
	})
}
