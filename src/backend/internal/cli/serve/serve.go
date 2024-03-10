package serve

import (
	"log"

	"github.com/Roongkun/software-eng-ii/internal/config"
	"github.com/Roongkun/software-eng-ii/internal/controller"
	"github.com/Roongkun/software-eng-ii/internal/controller/middleware"
	"github.com/Roongkun/software-eng-ii/internal/third-party/databases"
	"github.com/Roongkun/software-eng-ii/internal/third-party/s3utils"
	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"github.com/spf13/cobra"

	_ "github.com/Roongkun/software-eng-ii/docs"
	swaggerFiles "github.com/swaggo/files"
	ginSwagger "github.com/swaggo/gin-swagger"
)

// @title           Pic-keeper APIs
// @version         1.0
// @description     This is the back-end documentation of the pic-keeper project

// @license.name  Apache 2.0

// @host      localhost:8080
// @BasePath  /

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

		admin := r.Group("/admin")
		{
			admin := admin.Group("/v1")
			admin.Use(retrieveAdminSecretConf(appCfg))
			admin.POST("/login", handler.Admin.Login)
			admin.GET("/refresh", handler.Admin.RefreshToken)
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
			authen.POST("/register/photographer", handler.User.RegPhotographer)
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
			users := users.Group("/v1")
			users.PUT("/logout", handler.User.Logout)
			users.POST("/upload-profile", handler.User.UploadProfilePicture)
			users.GET("/get-my-user-info", handler.User.GetMyUserInfo)
			users.GET("/get-user/:id", handler.User.GetUserInfo)
			users.POST("/get-photographer-role", handler.User.GetPhotographerRole)

			photographers := users.Group("/photographers", handler.Photographer.GetPhotographerInstance)
			photographers.GET("/list-own-packages", handler.Photographer.ListOwnPackages)
			photographers.POST("/create-package", handler.Photographer.CreatePackage)
		}

		r.GET("/swagger/*any", ginSwagger.WrapHandler(swaggerFiles.Handler))
		r.Run()

		return nil
	},
}
