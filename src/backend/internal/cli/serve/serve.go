package serve

import (
	"github.com/Roongkun/software-eng-ii/internal/config"
	"github.com/Roongkun/software-eng-ii/internal/controller"
	"github.com/Roongkun/software-eng-ii/internal/controller/middleware"
	"github.com/Roongkun/software-eng-ii/internal/third-party/databases"
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

		db := databases.ConnectSQLDB(appCfg.Database.Postgres.DSN)
		handler := controller.NewHandler(db)
		databases.ConnectRedis(appCfg.Database.Redis.DSN)

		r := gin.Default()
		r.Use(retrieveSecretConf(appCfg))

		admin := r.Group("/admin")
		{
			admin := admin.Group("/v1")
			admin.Use(retrieveAdminSecretConf(appCfg))
			admin.POST("/login", handler.Admin.Login)
			admin.POST("/refresh", handler.Admin.RefreshToken)
			admin.Use(middleware.ValidateCredentials)
			admin.Use(handler.Admin.GetAdminInstance)

			verification := admin.Group("/verifications")
			{
				verification.GET("/unverified-photographers", handler.Admin.ListUnverifiedPhotographers)
				verification.PUT("/verify/:id", handler.Admin.Verify)
			}
			admin.PUT("/logout", handler.Admin.Logout)
		}

		authen := r.Group("/authen")
		{
			authen := authen.Group("/v1")
			authen.POST("/register/customer", handler.User.RegCustomer)
			authen.POST("/login", handler.User.Login)
			authen.GET("/refresh", handler.User.RefreshToken)
			google := authen.Group("/google")
			{
				google.Use(setOAuth2GoogleConf(appCfg))
				google.POST("/login", handler.User.GoogleLogin)
				google.GET("/callback", handler.User.GoogleCallback)
			}
		}

		validated := r.Group("/", middleware.UserAuthorizationMiddleware)
		validated.Use(handler.User.GetUserInstance)

		users := validated.Group("/users")
		{
			users.PUT("/v1/logout", handler.User.Logout)
		}

		r.Run()

		return nil
	},
}
