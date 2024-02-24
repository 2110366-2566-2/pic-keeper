package chat

import (
	"sync"

	"github.com/google/uuid"
)

// mapping of 1-N relationship
type Table struct {
	mu   sync.RWMutex
	data map[interface{}]map[uuid.UUID]struct{}
}

// return the table above which persists the data in-memory
func NewTableInMemory() *Table {
	return &Table{
		data: make(map[interface{}]map[uuid.UUID]struct{}),
	}
}

// return the slice of UUIDs of the given one
func (t *Table) Get(key interface{}) []uuid.UUID {
	items := t.get(key)
	if items == nil {
		return []uuid.UUID{}
	}

	result := make([]uuid.UUID, len(items))
	idx := 0
	for item := range items {
		result[idx] = item
		idx++
	}

	return result
}

func (t *Table) get(id interface{}) map[uuid.UUID]struct{} {
	t.mu.RLock()
	items := t.data[id]
	t.mu.RUnlock()

	return items
}

func (t *Table) Add(user, session uuid.UUID) {
	// map user with session
	t.add(UserId(user), session)
	// vice versa
	t.add(SessionId(session), user)
}

func (t *Table) add(one any, many uuid.UUID) {
	t.mu.Lock()
	if _, exist := t.data[one]; !exist {
		t.data[one] = make(map[uuid.UUID]struct{})
	}

	t.data[one][many] = struct{}{}
	t.mu.Unlock()
}
