package chat

import (
	"sync"

	"github.com/Roongkun/software-eng-ii/internal/controller/socketio"
	"github.com/Roongkun/software-eng-ii/internal/third-party/auth"
	"github.com/redis/go-redis"
)

type Chat struct {
	remote    *socketio.IORedis[Message]
	local     *socketio.IO[Message]
	waitGroup sync.WaitGroup
	done      chan struct{}
	eventCh   chan event
	auth      auth.JwtWrapper
	mu        sync.RWMutex
}

func New(channel string, client *redis.Client, auth auth.JwtWrapper) (*Chat, func()) {
	io := socketio.NewIO[Message]()
}
