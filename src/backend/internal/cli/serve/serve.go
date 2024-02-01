package serve

import (
	"database/sql"

	"github.com/Roongkun/software-eng-ii/internal/config"
	"github.com/Roongkun/software-eng-ii/internal/controller"
	"github.com/gin-gonic/gin"
	"github.com/spf13/cobra"
	"github.com/uptrace/bun"
	"github.com/uptrace/bun/dialect/pgdialect"
	"github.com/uptrace/bun/driver/pgdriver"
)

var ServeCmd = &cobra.Command{
	Use:   "serve [FLAGS]...",
	Short: "Serve application",
	RunE: func(cmd *cobra.Command, args []string) error {
		pathCfgFiles, err := cmd.Flags().GetStringSlice("config-file")
		if err != nil {
			return err
		}

		debug, err := cmd.Flags().GetBool("debug")
		if err != nil {
			return err
		}

		appCfg := config.MustReadMultipleAppConfigFiles(pathCfgFiles)
		if debug {
			printAppConfig(appCfg)
		}

		sqldb := sql.OpenDB(pgdriver.NewConnector(pgdriver.WithDSN(appCfg.Database.Postgres.DSN)))
		db := bun.NewDB(sqldb, pgdialect.New())
		handler := controller.NewHandler(db)

		r := gin.Default()
		authen := r.Group("/authen")
		{
			authen.POST("/v1/login", handler.User.Login)
		}

		r.Run()

		return nil
	},
}
