package databases

import (
	"context"
	"log"

	"github.com/redis/go-redis/v9"
)

var (
	RedisClient *redis.Client
)

func ConnectRedis(dsn string) {
	ctx := context.Background()

	RedisClient = redis.NewClient(&redis.Options{
		Addr: dsn,
	})

	if _, err := RedisClient.Ping(ctx).Result(); err != nil {
		log.Fatalf("ERROR: could not connect to Redis database --> %s", err.Error())
	}

	if err := RedisClient.Set(ctx, "health-check", "first key initiation", 0); err.Err() != nil {
		log.Fatalf(err.Err().Error())
	}

	log.Println("✅ Redis connected successfully")
}
