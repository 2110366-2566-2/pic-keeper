package chat

import (
	"net/http"
	"time"

	"github.com/gorilla/websocket"
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

type Chat struct {
	// this sends message to a room
	broadcast chan Message

	// this signals termination of the goroutine handling the broadcast
	quit chan struct{}

	// in-memory ds, will fetch from db if it does not exist
	// maps sessionId -> session; one-to-one
	session *Sessions

	// map sessionIds <-> userIds
	lookup *Table

	rooms *TableCache
	db    *bun.DB
}
