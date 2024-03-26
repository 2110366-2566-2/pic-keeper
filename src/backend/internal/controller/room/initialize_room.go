package room

import (
	"net/http"
	"time"

	"github.com/Roongkun/software-eng-ii/internal/controller/user"
	"github.com/Roongkun/software-eng-ii/internal/controller/util"
	"github.com/Roongkun/software-eng-ii/internal/model"
	"github.com/Roongkun/software-eng-ii/internal/usecase"
	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
)

func (r *Resolver) InitializeRoom(c *gin.Context) {
	userObj, ok := user.GetUser(c)
	if !ok {
		return
	}

	input := model.RoomMemberInput{}
	if err := c.BindJSON(&input); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"status": "failed",
			"error":  err.Error(),
		})
		c.Abort()
		return
	}

	otherUserIds := input.MemberIds
	input.MemberIds = append(input.MemberIds, userObj.Id)
	roomId := uuid.New()
	newRoom := &model.Room{
		Id:        roomId,
		GalleryId: input.GalleryId,
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
	for _, memberId := range input.MemberIds {
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

	if err := usecase.PopulateGalleryInRooms(c, r.GalleryUsecase, newRoom); err != nil {
		util.Raise500Error(c, err)
		return
	}

	otherUsers, err := r.UserUsecase.UserRepo.FindByIds(c, otherUserIds...)
	if err != nil {
		util.Raise500Error(c, err)
		return
	}
	newRoom.OtherUsers = otherUsers

	c.JSON(http.StatusOK, gin.H{
		"status": "success",
		"data":   newRoom,
	})
}
