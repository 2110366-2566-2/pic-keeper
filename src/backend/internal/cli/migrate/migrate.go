package migrate

import (
	"context"
	"database/sql"
	"log"

	"github.com/Roongkun/software-eng-ii/internal/config"
	"github.com/Roongkun/software-eng-ii/internal/migrations"
	"github.com/spf13/cobra"
	"github.com/uptrace/bun"
	"github.com/uptrace/bun/dialect/pgdialect"
	"github.com/uptrace/bun/driver/pgdriver"
	"github.com/uptrace/bun/migrate"
)

func init() {
	MigrateCmd.PersistentFlags().BoolP("debug", "d", false, "Run in debug mode")
	MigrateCmd.PersistentFlags().StringSliceP("config-file", "c", []string{}, "Path to configuration file")

	MigrateCmd.AddCommand(migrateUpCmd)
	MigrateCmd.AddCommand(migrateRollbackCmd)
	MigrateCmd.AddCommand(migrateCreateSQLCmd)
	MigrateCmd.AddCommand(migrateStatusCmd)
}

var MigrateCmd = &cobra.Command{
	Use:   "migrate",
	Short: "Run SQL Migrations",
}

type migrateCmdFlags struct {
	useDebugMode bool
	configFiles  []string
}

func getMigrateCmdFlags(cmd *cobra.Command) migrateCmdFlags {
	debug, err := cmd.Flags().GetBool("debug")
	if err != nil {
		panic(err.Error())
	}
	config, err := cmd.Flags().GetStringSlice("config-file")
	if err != nil {
		panic(err.Error())
	}
	return migrateCmdFlags{
		useDebugMode: debug,
		configFiles:  config,
	}
}

func getMigrateCmdMigrator(cmd *cobra.Command) *migrate.Migrator {
	flags := getMigrateCmdFlags(cmd)
	config := config.MustReadMultipleAppConfigFiles(flags.configFiles)
	sqldb := sql.OpenDB(pgdriver.NewConnector(pgdriver.WithDSN(config.Database.Postgres.DSN)))
	db := bun.NewDB(sqldb, pgdialect.New())

	return migrate.NewMigrator(db, migrations.Migrations)
}

var migrateUpCmd = &cobra.Command{
	Use:   "up",
	Short: "Migrate database",
	RunE: func(cmd *cobra.Command, args []string) error {
		migrator := getMigrateCmdMigrator(cmd)

		if err := migrator.Init(context.Background()); err != nil {
			return err
		}

		log.Print("Migration tables were initialized.\n")

		log.Print("Applying migrations...\n")
		group, err := migrator.Migrate(context.Background())
		if err != nil {
			return err
		}

		if group.IsZero() {
			log.Print("No migrations to apply.\n")
			return nil
		}

		log.Printf("Migrations applied: %s.\n", group.Migrations)
		for _, m := range group.Migrations {
			log.Printf("%s was applied.\n", m.String())
		}

		log.Printf("Migration completed.\n")

		return nil
	},
}

var migrateRollbackCmd = &cobra.Command{
	Use:   "rollback",
	Short: "Rolls back the last migration.",
	RunE: func(cmd *cobra.Command, args []string) error {
		migrator := getMigrateCmdMigrator(cmd)

		group, err := migrator.Rollback(context.Background())
		if err != nil {
			return err
		}

		if group.IsZero() {
			log.Print("No migrations were rollbacked.\n")
		}

		log.Printf("Rollbacked migrations: %s\n", group.Migrations)
		return nil
	},
}

var migrateCreateSQLCmd = &cobra.Command{
	Use:   "create-sql filename",
	Short: "Creates an SQL migration file.",
	Args:  cobra.ExactArgs(1),
	RunE: func(cmd *cobra.Command, args []string) error {
		migrator := migrate.NewMigrator(&bun.DB{}, migrations.Migrations)

		migrationFilename := args[0]
		files, err := migrator.CreateSQLMigrations(context.Background(), migrationFilename)
		if err != nil {
			return err
		}

		for _, file := range files {
			log.Printf("migration file created: %s\n", file.Path)
		}

		return nil
	},
}

var migrateStatusCmd = &cobra.Command{
	Use:   "status",
	Short: "Prints the status of the migrations.",
	RunE: func(cmd *cobra.Command, args []string) error {
		migrator := getMigrateCmdMigrator(cmd)

		ms, err := migrator.MigrationsWithStatus(context.Background())
		if err != nil {
			return err
		}

		log.Printf("migrations: %s\n", ms)
		log.Printf("unapplied migrations: %s\n", ms.Unapplied())
		log.Printf("last migration group: %s\n", ms.LastGroup())
		return nil
	},
}
