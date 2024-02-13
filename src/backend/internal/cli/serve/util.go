package serve

import (
	"database/sql"
	"encoding/json"
	"log"

	"github.com/redis/go-redis/v9"
	"github.com/uptrace/bun"
	"github.com/uptrace/bun/dialect/pgdialect"
	"github.com/uptrace/bun/driver/pgdriver"
)

var (
	RedisClient *redis.Client
)

func printAppConfig(appCfg any) {
	appCfgJSON, err := json.MarshalIndent(appCfg, "", "	")
	if err != nil {
		log.Fatalf("ERROR: could not MarshalIndent app config json; %s", err.Error())
	}
	log.Printf("current app config: \n%s\n", string(appCfgJSON))
}

func connectSQLDB(dsn string) *bun.DB {
	sqldb := sql.OpenDB(pgdriver.NewConnector(pgdriver.WithDSN(dsn)))
	return bun.NewDB(sqldb, pgdialect.New())
}

func connectRedis(dsn string) {
	// ctx := context.Background()

	RedisClient = redis.NewClient(&redis.Options{
		Addr: dsn,
	})

	// if _, err := RedisClient.ping
}
