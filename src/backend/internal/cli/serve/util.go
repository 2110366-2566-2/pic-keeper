package serve

import (
	"encoding/json"
	"log"

	"github.com/redis/go-redis/v9"
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
