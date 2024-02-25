package chat

import (
	"log"
	"net/http"
	"time"

	"github.com/Roongkun/software-eng-ii/internal/model"
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

func (c *Chat) newSession(ws *websocket.Conn) *Session {
	sess := NewSession(ws)
	c.sessions.Put(sess)
	return sess
}

// ties userId and sessionId together
func (c *Chat) Bind(uid UserId, sid SessionId) func() {
	log.Println("method: bind")
	log.Printf("user: %s\n", uid.String())
	log.Printf("session: %s\n", sid.String())

	// if the user has no sessions associated, create a new one
	if sess := c.Get(uid); len(sess) == 0 {
		c.Join(uid)
	}

	c.lookup.Add(uuid.UUID(uid), uuid.UUID(sid))

	return func() {
		session := c.sessions.Get(uuid.UUID(sid))
		c.Clear(session)

		if len(c.Get(uid)) == 0 {
			// clear room if no longer any session associated to that user
			c.Leave(uid)
		}
	}
}

// add user to an existing room
func (c *Chat) Join(uid UserId) {
	log.Println("method: join")
	log.Printf("user: %s\n", uid)

	rooms, err := c.r.RoomUsecase.FindByUserId(ctx, uuid.UUID(uid))
	if err != nil {
		log.Panicf("error getting rooms: %s\n", err.Error())
	}

	for _, room := range rooms {
		// notify other user in the room
		sender, receiver := uuid.UUID(uid), room.Id

		c.broadcast <- Message{
			Type:     MessageTypePresence,
			Sender:   sender,
			Receiver: receiver,
			Text:     MessageTypeOnline,
		}

		// then add the user after broadcast to avoid notifying themselves
		if err := c.rooms.Add(uuid.UUID(uid), room.Id); err != nil {
			log.Panicf("join error: %s\n", err.Error())
		}

		log.Println("joined room")
		log.Printf("room: %s\n", room.Id)
	}
}

// clear the user's session from the room
func (c *Chat) Leave(uid UserId) {
	log.Println("method: leave")
	log.Printf("user: %s\n", uid)

	// delete user for each room
	onDelete := func(roomId uuid.UUID) {
		log.Println("delete room")
		log.Printf("room: %s\n", roomId)

		sender, receiver := uuid.UUID(uid), roomId
		c.broadcast <- Message{
			Type:     MessageTypePresence,
			Sender:   sender,
			Receiver: receiver,
			Text:     MessageTypeOffline,
		}
	}

	// delete user -> rooms relationship
	if err := c.rooms.Delete(uuid.UUID(uid), onDelete); err != nil {
		log.Panicf("error removing from room: %s\n", err.Error())
	}

	log.Println("left room")
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
				conversation := model.Conversation{
					Id:        uuid.New(),
					Text:      msg.Text,
					UserId:    msg.Sender,
					RoomId:    msg.Receiver,
					CreatedAt: time.Now(),
					UpdatedAt: time.Now(),
					DeletedAt: nil,
				}
				if err := c.r.ConversationUsecase.ConversationRepo.AddOne(ctx, &conversation); err != nil {
					log.Panicf("error creating reply: %s\n", err.Error())
					continue
				}
			default:
			}
			c.Broadcast(msg)
		}
	}
}

// sends message to a room
func (c *Chat) Broadcast(msg Message) error {
	log.Println("method: broadcast")

	// get all users in the room
	users := c.rooms.GetUsers(msg.Receiver)
	for _, user := range users {
		sessionIds := c.lookup.Get(UserId(user))
		for _, sid := range sessionIds {
			sess := c.sessions.Get(sid)
			if sess == nil {
				log.Println("session does not exist")
				continue
			}
			err := sess.Conn().WriteJSON(msg)
			if err != nil {
				c.Clear(sess)
				return err
			}
		}
	}

	return nil
}

func (c *Chat) Clear(sess *Session) {
	if sess == nil {
		return
	}

	// close the connection and delete the session
	sess.Conn().Close()
	sessionId := sess.SessionID()
	c.sessions.Delete(sessionId)

	log.Println("cleared session")
	log.Println("method: clear")
}

// get sessions by userId or SessionId
// get by userId will return all sessions associated to that use
func (c *Chat) Get(key interface{}) []*Session {
	switch v := key.(type) {
	case SessionId:
		sess := c.sessions.Get(uuid.UUID(v))
		if sess == nil {
			return nil
		}
		return []*Session{sess}
	case UserId:
		var result []*Session
		sessions := c.lookup.Get(key)
		for _, sess := range sessions {
			session := c.sessions.Get(sess)
			if session != nil {
				result = append(result, session)
			}
		}
		return result
	default:
		return nil
	}
}

// terminates goroutines peacefully
func (c *Chat) Close() {
	c.quit <- struct{}{}
	close(c.quit)
	log.Println("closing")
}
