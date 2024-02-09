package serve

import (
	"database/sql"
	"encoding/json"
	"log"
	"net"

	"github.com/uptrace/bun"
	"github.com/uptrace/bun/dialect/pgdialect"
	"github.com/uptrace/bun/driver/pgdriver"
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

func getHostPhysicalIP() string {
	// Get all network interfaces
	interfaces, err := net.Interfaces()
	if err != nil {
		log.Fatalf("Error: %s", err.Error())
		return ""
	}

	// Iterate over each network interface
	for _, iface := range interfaces {
		// Ignore virtual services and loopback
		if iface.Flags&net.FlagLoopback != 0 || iface.Flags&net.FlagUp == 0 {
			continue
		}

		// Retrieve the hardware address
		addr := iface.HardwareAddr
		if len(addr) > 0 && iface.Name == "en0" {
			return addr.String()
		}
	}

	log.Fatalf("Physical Address not found")
	return ""
}
