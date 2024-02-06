package serve

import (
	"github.com/Roongkun/software-eng-ii/internal/config"
	"github.com/Roongkun/software-eng-ii/internal/controller"
	"github.com/Roongkun/software-eng-ii/internal/controller/middleware"
	"github.com/gin-gonic/gin"
	"github.com/spf13/cobra"
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

		db := connectSQLDB(appCfg.Database.Postgres.DSN)
		handler := controller.NewHandler(db)

		r := gin.Default()
		r.Use(retrieveSecretConf(appCfg))

		authen := r.Group("/authen")
		{
			authen.POST("/v1/login", handler.User.Login)
			google := authen.Group("/v1/google")
			{
				google.Use(setOAuth2GoogleConf(appCfg))
				google.POST("/login", handler.User.GoogleLogin)
				google.POST("/callback", handler.User.GoogleCallback)
			}
		}

		validated := r.Group("/", middleware.AuthorizationMiddleware)
		validated.Use(handler.User.GetUserInstance)

		users := validated.Group("/users")
		{
			users.PUT("/v1/logout", handler.User.Logout)
		}

		r.Run()

		return nil
	},
}
