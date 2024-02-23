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
		io.deregister(socket)
	}
}

func (io *IO[T]) Error(socketId uuid.UUID, err error) bool {
	io.mu.RLock()
	socket, ok := io.sockets[socketId]
	io.mu.RUnlock()

	if !ok {
		return false
	}

	return socket.Error(NewError(err.Error()))
}

func (io *IO[T]) Emit(socketId uuid.UUID, msg T) bool {
	io.mu.RLock()
	socket, ok := io.sockets[socketId]
	io.mu.RUnlock()

	if !ok {
		return false
	}

	return socket.Emit(msg)
}

func (io *IO[T]) EmitAny(socketId uuid.UUID, msg any) bool {
	io.mu.RLock()
	socket, ok := io.sockets[socketId]
	io.mu.RUnlock()

	if !ok {
		return false
	}

	return socket.EmitAny(msg)
}

func (io *IO[T]) BroadcastAny(msg any) (total int, sent int) {
	io.mu.Lock()
	total = len(io.sockets)
	io.mu.Unlock()

	for _, socket := range io.sockets {
		if socket.EmitAny(msg) {
			sent++
		}
	}

	return
}

func (io *IO[T]) Broadcast(msg T) (total int, sent int) {
	io.mu.Lock()
	total = len(io.sockets)
	io.mu.Unlock()

	for _, socket := range io.sockets {
		if socket.Emit(msg) {
			sent++
		}
	}

	return
}

func (io *IO[T]) register(socket *Socket[T]) {
	io.mu.Lock()
	io.sockets[socket.ID] = socket
	io.mu.Unlock()
}

func (io *IO[T]) deregister(socket *Socket[T]) {
	io.mu.Lock()

	socket, ok := io.sockets[socket.ID]
	if ok {
		socket.close()
		delete(io.sockets, socket.ID)
	}

	io.mu.Unlock()
}
