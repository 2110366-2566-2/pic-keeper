package serve

import (
	"log"

	"github.com/Roongkun/software-eng-ii/internal/config"
	"github.com/Roongkun/software-eng-ii/internal/controller"
	"github.com/Roongkun/software-eng-ii/internal/controller/middleware"
	"github.com/Roongkun/software-eng-ii/internal/third-party/s3utils"
	"github.com/gin-contrib/cors"
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

		r.Use(cors.New(cors.Config{
			AllowOrigins:     []string{"http://localhost:3000"},
			AllowMethods:     []string{"GET", "PUT", "PATCH", "OPTIONS"},
			AllowHeaders:     []string{"Origin", "Content-Type", "Authorization"},
			ExposeHeaders:    []string{"Content-Length"},
			AllowCredentials: true,
		}))

		if err := s3utils.InitializeS3(); err != nil {
			log.Fatalf("Failed to initialize S3: %v", err)
		}

		authen := r.Group("/authen")
		{
			authen.POST("/v1/register/customer", handler.User.RegCustomer)
			authen.POST("/v1/login", handler.User.Login)
			google := authen.Group("/v1/google")
			{
				google.Use(setOAuth2GoogleConf(appCfg))
				google.POST("/login", handler.User.GoogleLogin)
				google.GET("/callback", handler.User.GoogleCallback)
			}
		}

		validated := r.Group("/", middleware.AuthorizationMiddleware)
		validated.Use(handler.User.GetUserInstance)

		users := validated.Group("/users")
		{
			users.PUT("/v1/logout", handler.User.Logout)
			users.POST("/v1/upload-profile", handler.User.UploadProfilePicture)
			users.GET("/v1/get-my-user-info", handler.User.GetMyUserInfo)
			users.GET("/v1/get-user/:id", handler.User.GetUserInfo)
		}

		r.Run()

		return nil
	},
}
