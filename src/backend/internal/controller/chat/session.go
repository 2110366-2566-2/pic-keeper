package chat

import (
	"sync"

	"github.com/google/uuid"
	"github.com/gorilla/websocket"
)

// this represents user session.
// one user -> many sessions.
type Session struct {
	id   uuid.UUID
	conn *websocket.Conn
}

func NewSession(conn *websocket.Conn) *Session {
	return &Session{
		id:   uuid.New(),
		conn: conn,
	}
}

func (s *Session) Conn() *websocket.Conn {
	return s.conn
}

func (s *Session) SessionID() uuid.UUID {
	return s.id
}

// this is a wrapper around sessions
type Sessions struct {
	mu       sync.RWMutex
	sessions map[uuid.UUID]*Session
}

func NewSessions() *Sessions {
	return &Sessions{
		sessions: make(map[uuid.UUID]*Session),
	}
}

// insert new session
func (ss *Sessions) Put(s *Session) {
	ss.mu.Lock()
	ss.sessions[s.id] = s
	ss.mu.Unlock()
}

// find one by id
func (ss *Sessions) Get(id uuid.UUID) *Session {
	ss.mu.RLock()
	s := ss.sessions[id]
	ss.mu.RUnlock()
	return s
}

func (ss *Sessions) Delete(id uuid.UUID) {
	ss.mu.Lock()
	delete(ss.sessions, id)
	ss.mu.Unlock()
}
