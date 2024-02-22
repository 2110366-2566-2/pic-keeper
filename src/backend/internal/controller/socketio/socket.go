package socketio

import (
	"sync"
	"time"

	"github.com/google/uuid"
	"github.com/gorilla/websocket"
)

const (
	writeTimeout   = 10 * time.Second
	pongTimeout    = 60 * time.Second
	pingTimeout    = (pongTimeout * 9) / 10
	maxMessageSize = 512
)

type Socket[T any] struct {
	ID             uuid.UUID
	WriteTimeout   time.Duration
	PingTimeout    time.Duration
	PongTimeout    time.Duration
	MaxMessageSize int64

	conn      *websocket.Conn
	done      chan struct{}
	quit      sync.Once
	waitGroup sync.WaitGroup
	errCh     chan *SocketError
	readCh    chan T
	writeCh   chan any
}

func NewSocket[T any](conn *websocket.Conn) (*Socket[T], func()) {
	socket := &Socket[T]{
		ID:             uuid.New(),
		WriteTimeout:   writeTimeout,
		PingTimeout:    pingTimeout,
		PongTimeout:    pongTimeout,
		MaxMessageSize: maxMessageSize,

		conn:    conn,
		done:    make(chan struct{}),
		errCh:   make(chan *SocketError),
		readCh:  make(chan T),
		writeCh: make(chan any),
	}

	socket.waitGroup.Add(1)

	go func() {
		defer socket.waitGroup.Done()
		socket.reader()
	}()

	return socket, socket.close
}

func (s *Socket[T]) Emit(msg T) bool {
	select {
	case <-s.done:
		return false
	case s.writeCh <- msg:
		return true
	}
}

func (s *Socket[T]) EmitAny(msg any) bool {
	select {
	case <-s.done:
		return false
	case s.writeCh <- msg:
		return true
	}
}

func (s *Socket[T]) Listen() <-chan T {
	return s.readCh
}

func (s *Socket[T]) close() {
	s.quit.Do(func() {
		close(s.done)
		s.waitGroup.Wait()
		s.conn.Close()
	})
}

func (s *Socket[T]) Error(err *SocketError) bool {
	select {
	case <-s.done:
		return false
	case s.errCh <- err:
		return true
	}
}

func (s *Socket[T]) writer() {
	pinger := time.NewTicker(s.PingTimeout)
	defer pinger.Stop()

	for {
		select {
		case <-s.done:
			writeClose(s.conn)
			return
		case err := <-s.errCh:
			writeError(s.conn, err.Code, err)
			return
		case msg := <-s.writeCh:
			s.conn.SetWriteDeadline(time.Now().Add(s.WriteTimeout))

			if err := s.conn.WriteJSON(msg); err != nil {
				writeError(s.conn, websocket.CloseInternalServerErr, err)
				return
			}
		case <-pinger.C:
			s.conn.SetWriteDeadline(time.Now().Add(s.WriteTimeout))

			if err := writePing(s.conn); err != nil {
				return
			}

		}
	}
}

func (s *Socket[T]) reader() {
	defer close(s.readCh)

	for {
		s.conn.SetReadDeadline(time.Now().Add(s.PongTimeout))
		s.conn.SetReadLimit(s.MaxMessageSize)
		s.conn.SetPongHandler(func(string) error {
			return s.conn.SetReadDeadline(time.Now().Add(s.PongTimeout))
		})

		var msg T
		if err := s.conn.ReadJSON(&msg); err != nil {
			return
		}

		select {
		case <-s.done:
			return
		case s.readCh <- msg:
		}
	}
}
