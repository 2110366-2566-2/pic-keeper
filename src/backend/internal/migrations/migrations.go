package migrations

import (
	"embed"
	"log"

	"github.com/uptrace/bun/migrate"
)

var Migrations = migrate.NewMigrations()

//go:embed *.sql
var migrationFiles embed.FS

func init() {
	if err := Migrations.Discover(migrationFiles); err != nil {
		log.Fatalln(err.Error())
	}
}
