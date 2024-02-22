package socketio

import (
	"fmt"
	"net/http"
	"sync"

	"github.com/google/uuid"
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
	sockets    map[uuid.UUID]*Socket[T]
}

func NewIO[T any]() *IO[T] {
	return &IO[T]{
		Upgrader: websocket.Upgrader{
			ReadBufferSize:  readBufferSize,
			WriteBufferSize: writeBufferSize,
		},
		sockets: make(map[uuid.UUID]*Socket[T]),
	}
}

func (io *IO[T]) ServeWS(w http.ResponseWriter, r *http.Request) (*Socket[T], error, func()) {
	ws, err := io.Upgrade(w, r, nil)
	if err != nil {
		return nil, fmt.Errorf("io: failed to upgrade websocket connection: %w", err), nil
	}

	socket, _ := NewSocket[T](ws)
	if io.SocketFunc != nil {
		io.SocketFunc(socket)
	}

	io.register(socket)

	return socket, nil, func() {
		stringio.deregister(socket)
	}
}

func (io *IO[T]) Error(socketId)
