package room

import (
	"net/http"
	"time"

	"github.com/Roongkun/software-eng-ii/internal/model"
	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
)

func (r *Resolver) InitializeRoom(c *gin.Context) {
	user := c.MustGet("user")
	userObj, ok := user.(model.User)
	if !ok {
		c.JSON(http.StatusBadRequest, gin.H{
			"status": "failed",
			"error":  "could not bind json",
		})
		c.Abort()
		return
	}

	roomMemberIds := []uuid.UUID{}
	if err := c.BindJSON(&roomMemberIds); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"status": "failed",
			"error":  err.Error(),
		})
		c.Abort()
		return
	}

	roomMemberIds = append(roomMemberIds, userObj.Id)
	roomId := uuid.New()
	newRoom := &model.Room{
		Id:        roomId,
		CreatedAt: time.Now(),
		UpdatedAt: time.Now(),
		DeletedAt: nil,
	}

	if err := r.RoomUsecase.RoomRepo.AddOne(c, newRoom); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"status": "failed",
			"error":  err.Error(),
		})
		c.Abort()
		return
	}

	lookups := []*model.UserRoomLookup{}
	for _, memberId := range roomMemberIds {
		lookups = append(lookups, &model.UserRoomLookup{
			Id:        uuid.New(),
			UserId:    memberId,
			RoomId:    roomId,
			CreatedAt: time.Now(),
			UpdatedAt: time.Now(),
			DeletedAt: nil,
		})
	}

	if err := r.LookupUsecase.LookupRepo.AddBatch(c, lookups); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"status": "failed",
			"error":  err.Error(),
		})
		c.Abort()
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"status": "success",
		"data":   lookups,
	})
}
