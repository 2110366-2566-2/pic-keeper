package chat

import (
	"log"
	"net/http"
	"time"

	"github.com/Roongkun/software-eng-ii/internal/model"
	"github.com/gin-gonic/gin"
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

type Chat struct {
	// this sends message to a room
	broadcast chan Message

	// this signals termination of the goroutine handling the broadcast
	quit chan struct{}

	// maps sessionId -> session; one-to-one
	sessions *Sessions

	// maps sessionIds <-> userId; many-to-one
	lookupTable *Table

	// maps roomIds <-> userIds; many-to-many
	rooms    *TableCache
	Resolver *Resolver
}

func NewChat(db *bun.DB, client *redis.Client, resolver *Resolver) *Chat {
	c := Chat{
		broadcast:   make(chan Message, defaultBroadcastQueueSize),
		quit:        make(chan struct{}),
		sessions:    NewSessions(),
		lookupTable: NewTableInMemory(),
		rooms:       NewTableCache(client),
		Resolver:    resolver,
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

	c.lookupTable.Add(uuid.UUID(uid), uuid.UUID(sid))

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

	lookups, err := c.Resolver.LookupUsecase.FindByUserId(ctx, uuid.UUID(uid))
	if err != nil {
		log.Panicf("error getting rooms: %s\n", err.Error())
	}

	for _, lookup := range lookups {
		// notify other user in the room
		sender, receiver := uuid.UUID(uid), lookup.RoomId

		c.broadcast <- Message{
			ID:        uuid.New(),
			Type:      MessageTypePresence,
			Sender:    sender,
			Receiver:  receiver,
			Text:      MessageTypeOnline,
			Timestamp: time.Now(),
		}

		// then add the user after broadcast to avoid notifying themselves
		if err := c.rooms.Add(uuid.UUID(uid), lookup.RoomId); err != nil {
			log.Panicf("join error: %s\n", err.Error())
		}

		log.Println("joined room")
		log.Printf("room: %s\n", lookup.RoomId.String())
	}
}

// clear the user's session from the room
func (c *Chat) Leave(uid UserId) {
	log.Println("method: leave")
	log.Printf("user: %s\n", uid)

	// delete user for each room
	onDelete := func(roomId uuid.UUID) {
		log.Println("delete user from room")
		log.Printf("room: %s\n", roomId)

		sender, receiver := uuid.UUID(uid), roomId
		c.broadcast <- Message{
			Type:      MessageTypePresence,
			Sender:    sender,
			Receiver:  receiver,
			Text:      MessageTypeOffline,
			Timestamp: time.Now(),
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
			log.Printf("type: %s\n", msg.Type)
			log.Printf("receiver: %s\n", msg.Receiver)
			log.Printf("sender: %s\n", msg.Sender)
			log.Printf("text: %s\n", msg.Text)

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
				if err := c.Resolver.ConversationUsecase.ConversationRepo.AddOne(ctx, &conversation); err != nil {
					log.Panicf("error creating reply: %s\n", err.Error())
					continue
				}
				msg.ID = conversation.Id
				msg.Timestamp = conversation.CreatedAt
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
		if user == msg.Sender {
			continue
		}
		sessionIds := c.lookupTable.Get(UserId(user))
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
	c.lookupTable.Delete(SessionId(sessionId))

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
		sessions := c.lookupTable.Get(key)
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

func ping(ws *websocket.Conn) {
	ticker := time.NewTicker(pingPeriod)
	defer func() {
		ticker.Stop()
		ws.Close()
	}()

	for range ticker.C {
		ws.SetWriteDeadline(time.Now().Add(writeWait))
		if err := ws.WriteMessage(websocket.PingMessage, []byte{}); err != nil {
			break
		}
	}
}

func (c *Chat) ServeWS(gc *gin.Context) {
	if gc.Request.Method != http.MethodGet {
		gc.JSON(http.StatusMethodNotAllowed, gin.H{
			"status": "failed",
			"error":  "method not allowed",
		})
		gc.Abort()
		return
	}

	ws, err := upgrader.Upgrade(gc.Writer, gc.Request, nil)
	if err != nil {
		gc.JSON(http.StatusBadRequest, gin.H{
			"status": "failed",
			"error":  err.Error(),
		})
	}

	defer ws.Close()

	user := gc.MustGet("user")
	userModel := user.(model.User)

	session := c.newSession(ws)
	close := c.Bind(UserId(userModel.Id), SessionId(session.id))
	defer close()

	// notify that a user went online
	ws.SetReadLimit(maxMessageSize)
	ws.SetReadDeadline(time.Now().Add(pongWait))
	ws.SetPongHandler(func(string) error {
		ws.SetReadDeadline(time.Now().Add(pongWait))
		return nil
	})

	go ping(ws)

	for {
		var msg Message
		if err := ws.ReadJSON(&msg); err != nil {
			if websocket.IsUnexpectedCloseError(err, websocket.CloseGoingAway) {
				log.Printf("error: %v, user-agent: %v", err, gc.Request.Header.Get("User-Agent"))
			}
			break
		}

		msg.Sender = userModel.Id
		c.broadcast <- msg
	}
}
