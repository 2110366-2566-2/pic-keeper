package cmd

import (
	"log"

	"github.com/Roongkun/software-eng-ii/internal/cli/migrate"
)

func main() {
	if err := migrate.MigrateCmd.Execute(); err != nil {
		log.Fatalln(err.Error())
	}
}
