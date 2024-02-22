package socketio

import (
	"sync"

	"github.com/gorilla/websocket"
)

const (
	readBufferSize  = 1024
	writeBufferSize = 1024
)

type IO[T any] struct {
	websocket.Upgrader
	SocketFunc func(s *Socket[T]) error
	mu         sync.RWMutex
	sockets    map[string]*Socket[T]
}
