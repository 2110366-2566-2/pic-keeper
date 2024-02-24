package chat

import (
	"log"
	"net/http"
	"time"

	"github.com/Roongkun/software-eng-ii/internal/usecase"
	"github.com/google/uuid"
	"github.com/gorilla/websocket"
	"github.com/redis/go-redis/v9"
	"github.com/uptrace/bun"
)

var (
	// time allowed to write a message to the peer
	writeWait = 10 * time.Second

	maxMessageSize int64 = 512

	// time allowed to read the next pong message from the peer
	pongWait = 60 * time.Second

	// send pings to peer with this period, it must be less than the pongWait above
	pingPeriod = (pongWait * 9) / 10

	defaultBroadcastQueueSize = 10000
)

var upgrader = websocket.Upgrader{
	ReadBufferSize:  1024,
	WriteBufferSize: 1024,
	CheckOrigin: func(r *http.Request) bool {
		return true
		// for the ease of development
	},
}

type Resolver struct {
	RoomUsecase         usecase.RoomUseCase
	LookupUsecase       usecase.LookupUseCase
	ConversationUsecase usecase.ConversationUseCase
}

func NewResolver(db *bun.DB) *Resolver {
	return &Resolver{
		RoomUsecase:         *usecase.NewRoomUseCase(db),
		LookupUsecase:       *usecase.NewLookupUseCase(db),
		ConversationUsecase: *usecase.NewConversationUseCase(db),
	}
}

type Chat struct {
	// this sends message to a room
	broadcast chan Message

	// this signals termination of the goroutine handling the broadcast
	quit chan struct{}

	// in-memory ds, will fetch from db if it does not exist
	// maps sessionId -> session; one-to-one
	sessions *Sessions

	// maps sessionIds <-> userId; many-to-one
	lookup *Table
	// maps roomIds <-> userIds; many-to-many
	rooms *TableCache
	r     *Resolver
}

func NewChat(db *bun.DB, client *redis.Client) *Chat {
	c := Chat{
		broadcast: make(chan Message, defaultBroadcastQueueSize),
		quit:      make(chan struct{}),
		sessions:  NewSessions(),
		lookup:    NewTableInMemory(),
		rooms:     NewTableCache(client),
		r:         NewResolver(db),
	}

	log.Println("starting event loop")
	go c.eventloop()
	return &c
}

func (c *Chat) eventloop() {
	log.Println("event loop started")
	getStatus := func(userId uuid.UUID) string {
		sessions := c.Get(UserId(userId))
		// no sessions existed
		if len(sessions) == 0 {
			return "0"
		}

		return "1'"
	}

loop:
	for {
		select {
		case <-c.quit:
			log.Println("quit")
			break loop
		case msg, ok := <-c.broadcast:
			if !ok {
				break loop
			}

			log.Println()
			log.Println("processing message:")
			log.Println("type: %s", msg.Type)
			log.Println("receiver: %s", msg.Receiver)
			log.Println("sender: %s", msg.Sender)
			log.Println("text: %s", msg.Text)

			switch msg.Type {
			case MessageTypeStatus:
				// requesting the status of a particular user
				// msg.Text is the userId in question
				msg.Text = getStatus(uuid.MustParse(msg.Text))
			case MessageTypeAuth:
				msg.Text = msg.Sender.String()
			case MessageTypeMessage:

			}
		}
	}
}
