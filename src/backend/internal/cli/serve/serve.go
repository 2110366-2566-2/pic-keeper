package serve

import (
	"context"

	"github.com/Roongkun/software-eng-ii/internal/config"
	"github.com/Roongkun/software-eng-ii/internal/controller"
	"github.com/Roongkun/software-eng-ii/internal/controller/middleware"
	"github.com/Roongkun/software-eng-ii/internal/model"
	"github.com/gin-gonic/gin"
	"github.com/spf13/cobra"
)

func retrieveSecretConf(appCfg *config.App) gin.HandlerFunc {
	return func(c *gin.Context) {
		c.Request = c.Request.WithContext(context.WithValue(c.Request.Context(), model.ContextKey("secretKey"), appCfg.SecretKey))
		c.Next()
	}
}

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
		}

		validated := r.Group("/", middleware.AuthorizationMiddleware)

		users := validated.Group("/users", handler.User.GetUserInstance)
		{
			users.PUT("/v1/logout", handler.User.Logout)
		}

		r.Run()

		return nil
	},
}
