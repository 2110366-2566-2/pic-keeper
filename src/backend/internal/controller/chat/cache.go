package chat

import (
	"context"
	"fmt"

	"github.com/google/uuid"
	"github.com/redis/go-redis/v9"
)

var (
	ctx = context.Background()
)

type TableCache struct {
	client *redis.Client
}

func NewTableCache(client *redis.Client) *TableCache {
	return &TableCache{client}
}

func (t *TableCache) Add(user, room uuid.UUID) error {
	pipe := t.client.Pipeline()
	// add room to the user's list
	pipe.SAdd(ctx, userKey(user), room.String())
	// vice versa
	pipe.SAdd(ctx, roomKey(room), user.String())
	_, err := pipe.Exec(context.Background())
	return err
}

func userKey(userId uuid.UUID) string {
	return fmt.Sprintf("user: %s", userId.String())
}

func roomKey(roomId uuid.UUID) string {
	return fmt.Sprintf("user: %s", roomId.String())
}

func (t *TableCache) Delete(userId uuid.UUID, fn func(uuid.UUID)) error {
	roomIds := t.client.SMembers(ctx, userKey(userId)).Val()

	pipe := t.client.Pipeline()

	for _, roomId := range roomIds {
		rid := uuid.MustParse(roomId)
		pipe.SRem(ctx, roomKey(rid), userId)
		fn(rid)
	}

	_, err := pipe.Exec(ctx)
	return err
}

// get rooms by userId
func (t *TableCache) GetRooms(userId uuid.UUID) []uuid.UUID {
	result := []uuid.UUID{}
	rooms := t.client.SMembers(ctx, userKey(userId)).Val()
	for _, room := range rooms {
		result = append(result, uuid.MustParse(room))
	}
	return result
}

// get users by roomId
func (t *TableCache) GetUsers(roomId uuid.UUID) []uuid.UUID {
	result := []uuid.UUID{}
	users := t.client.SMembers(ctx, userKey(roomId)).Val()
	for _, user := range users {
		result = append(result, uuid.MustParse(user))
	}
	return result
}
