package chat

import (
	"fmt"
	"log"
	"net/http"
	"sync"

	"github.com/Roongkun/software-eng-ii/internal/controller/socketio"
	"github.com/Roongkun/software-eng-ii/internal/model"
	"github.com/Roongkun/software-eng-ii/internal/third-party/auth"
	"github.com/gin-gonic/gin"
	"github.com/redis/go-redis/v9"
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
	ioredis, close := socketio.NewIORedis[Message](channel, client)

	chat := &Chat{
		remote:  ioredis,
		local:   io,
		done:    make(chan struct{}),
		eventCh: make(chan event),
		auth:    auth,
	}

	chat.loopAsync()

	return chat, close
}

// TODO: check contacts
func (c *Chat) ServeWS(ctx *gin.Context) {
	user := ctx.MustGet("user")
	userModel := user.(model.User)
	socket, err, flush := c.local.ServeWS(ctx.Writer, ctx.Request)
	if err != nil {
		http.Error(ctx.Writer, err.Error(), http.StatusBadRequest)
		return
	}

	defer flush()

	c.eventCh <- Connected{
		userId:    userModel.Id,
		sessionId: socket.ID,
	}

	defer func() {
		c.eventCh <- Disconnected{
			userId:    userModel.Id,
			sessionId: socket.ID,
		}
	}()

	for msg := range socket.Listen() {
		msg.From = userModel.Id

		user
	}
}

func (c *Chat) loop() {
	ch, stop := c.remote.Subscribe()
	defer stop()

	for {
		select {
		case <-c.done:
			return
		case event := <-c.eventCh:
			c.eventProcessor(event)
		case msg := <-ch:
			c.emitLocal(msg)
		}
	}
}

func (c *Chat) loopAsync() {
	c.waitGroup.Add(1)

	go func() {
		defer c.waitGroup.Done()
		c.loop()
	}()
}

func (c *Chat) eventProcessor(evt event) {
	switch e := evt.(type) {
	case Connected:
		c.connected(e)
	case Disconnected:
		c.disconnected(e)
	default:
		log.Panicln(fmt.Errorf("chat: unhandled event processor: %+v", evt))
	}
}
