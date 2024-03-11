package serve

import (
	"encoding/json"
	"log"

	"github.com/Roongkun/software-eng-ii/internal/controller"
	"github.com/redis/go-redis/v9"
	"github.com/robfig/cron/v3"
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

func autoUpdateBookingStatus(handler *controller.Handler) {
	scheduler := cron.New()
	scheduler.AddFunc("@every 1m", func() {
		handler.User.BookingUsecase.UpdateStatusRoutine()
	})
}
