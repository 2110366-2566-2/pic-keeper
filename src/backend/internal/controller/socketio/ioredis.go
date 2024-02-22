package socketio

import (
	"sync"

	"github.com/redis/go-redis/v9"
)

type IORedis[T any] struct {
	Client    *redis.Client
	waitGroup sync.WaitGroup
	channel   string
	done      chan struct{}
	quit      sync.Once
}

func NewIORedis[T any](channel string, client *redis.Client) (*IORedis[T], func()) {
	io := &IORedis[T]{
		Client:  client,
		channel: channel,
		done:    make(chan struct{}),
	}

	io.subscribeAsync()

	return io, io.close()
}

func (io *IORedis[T]) subscribeAsync() chan T {
	ch := make(chan T)
	io.waitGroup.Add(1)

	go func() {
		defer io.waitGroup.Done()
		
		io.subscribe(ch)
	}

	return ch
}

func (io *IORedis[T]) subscribe(ch chan<- T) {

}
