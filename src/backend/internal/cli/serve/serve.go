package serve

import (
	"log"

	"github.com/Roongkun/software-eng-ii/internal/config"
	"github.com/Roongkun/software-eng-ii/internal/controller"
	"github.com/Roongkun/software-eng-ii/internal/controller/chat"
	"github.com/Roongkun/software-eng-ii/internal/controller/middleware"
	"github.com/Roongkun/software-eng-ii/internal/controller/util"
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
		redisClient := databases.ConnectRedis(appCfg.Database.Redis.DSN)
		util.InitNgrokEndpoint(appCfg.NgrokEndpoint)

		autoUpdateBookingStatus(handler)

		r := gin.Default()
		r.Use(retrieveSecretConf(appCfg))

		r.Use(cors.New(cors.Config{
			AllowOrigins:     []string{"http://localhost:3000"},
			AllowMethods:     []string{"GET", "POST", "DELETE", "PUT", "PATCH", "OPTIONS"},
			AllowHeaders:     []string{"Origin", "Content-Type", "Authorization"},
			ExposeHeaders:    []string{"Content-Length"},
			AllowCredentials: true,
		}))

		if err := s3utils.InitializeS3(); err != nil {
			log.Fatalf("Failed to initialize S3: %v", err)
		}

		authen := r.Group("/authen")
		{
			authen := authen.Group("/v1")
			authen.POST("/register", handler.User.Register)
			authen.POST("/login", handler.User.Login)
			authen.GET("/refresh", handler.User.RefreshToken)

			google := authen.Group("/google")
			{
				google.Use(setOAuth2GoogleConf(appCfg))
				google.POST("/login", handler.User.GoogleLogin)
				google.GET("/callback", handler.User.GoogleCallback)
			}
		}

		chatEntity := chat.NewChat(db, redisClient, &handler.Chat)
		defer chatEntity.Close()

		chats := r.Group("/chat")
		{
			chats := chats.Group("/v1")
			chats.GET("/ws/:session-token", chatEntity.ServeWS)
		}

		customerGalleries := r.Group("/customers/galleries/v1")
		{
			customerGalleries.GET("/search", handler.User.SearchGalleries)
			customerGalleries.GET("/:id", handler.User.GetPhotoUrlsInGallery)
		}

		usersNonValidated := r.Group("/users/v1")
		{
			usersNonValidated.GET("/get-user/:id", handler.User.GetUserInfo)
		}

		phtgGalleriesNonValidated := r.Group("photographers/galleries/v1")
		{
			phtgGalleriesNonValidated.GET("/:id", handler.Photographer.GetOneGallery)
		}

		validated := r.Group("/", middleware.UserAuthorizationMiddleware)
		validated.Use(handler.User.GetUserInstance)

		users := validated.Group("/users")
		{
			users := users.Group("/v1")
			users.PUT("/logout", handler.User.Logout)
			users.POST("/upload-profile", handler.User.UploadProfilePicture)
			users.GET("/get-my-user-info", handler.User.GetMyUserInfo)
			users.PUT("/", handler.User.UpdateUserProfile)
			users.PUT("/req-verify", handler.User.RequestVerification)
			users.GET("/self-status", handler.User.GetSelfStatus)
			users.POST("/report-issue", handler.User.ReportIssue)
		}

		admin := validated.Group("/admin")
		{
			admin := admin.Group("/v1")
			admin.GET("/pending-photographers", handler.Admin.ListPendingPhotographers)
			admin.PUT("/verify/:id", handler.Admin.Verify)
			admin.PUT("/reject/:id", handler.Admin.Reject)
			admin.GET("/pending-refund-bookings", handler.Admin.ListPendingRefundBookings)
			admin.PUT("/bookings/reject/:id", handler.Admin.RejectRefundBooking)
			admin.PUT("/bookings/refund/:id", handler.Admin.ApproveRefundBooking)
			admin.GET("/issues", handler.Admin.GetIssuesWithOption)
			admin.GET("/issue-header", handler.Admin.GetIssueHeaderMetadata)
		}

		photographers := validated.Group("/photographers", handler.User.CheckVerificationStatus)
		{
			phtgGalleries := photographers.Group("/galleries/v1")
			phtgGalleries.GET("/list", handler.Photographer.ListOwnGalleries)
			phtgGalleries.POST("/", handler.Photographer.CreateGallery)
			phtgGalleries.POST("/:id", handler.Photographer.UploadPhotoToGallery)
			phtgGalleries.PUT("/:id", handler.Photographer.UpdateGallery)
			phtgGalleries.DELETE("/:id/:photoId", handler.Photographer.DeletePhoto)
			phtgGalleries.DELETE("/:id", handler.Photographer.DeleteGallery)

			phtgBookings := photographers.Group("/bookings/v1")
			phtgBookings.GET("/pending-cancellations", handler.Photographer.ListPendingCancellationBookings)
			phtgBookings.GET("/upcoming", handler.Photographer.ListUpcomingBookings)
			phtgBookings.GET("/past", handler.Photographer.ListPastBookings)
			phtgBookings.GET("/my-bookings", handler.Photographer.MyBookings)
			phtgBookings.PUT("/cancel/:id", handler.Photographer.CancelBooking)
			phtgBookings.PUT("/approve-cancel/:id", handler.Photographer.ApproveCancelReq)
		}

		customerBookings := validated.Group("/customers/bookings/v1")
		{
			customerBookings.POST("/", handler.User.CreateBooking)
			customerBookings.GET("/get-qr/:id", handler.User.GetQRCode)
			customerBookings.GET("/pending-cancellations", handler.User.ListPendingCancellationBookings)
			customerBookings.GET("/upcoming", handler.User.ListUpcomingBookings)
			customerBookings.GET("/past", handler.User.ListPastBookings)
			customerBookings.GET("/my-bookings", handler.User.MyBookings)
			customerBookings.GET("/:id", handler.User.GetOneBooking)
			customerBookings.PUT("/cancel/:id", handler.User.CancelBooking)
			customerBookings.PUT("/req-refund/:id", handler.User.RequestRefundBooking)
			customerBookings.PUT("/approve-cancel/:id", handler.User.ApproveCancelReq)
		}

		rooms := validated.Group("/rooms")
		{
			rooms := rooms.Group("/v1")
			rooms.POST("/", handler.Room.InitializeRoom)
			rooms.GET("/", handler.Room.GetRooms)
			rooms.GET("/:id", handler.Room.GetRoom)
			rooms.GET("/conversation/:id", handler.Room.GetAllConversations)
			rooms.GET("/gallery/:galleryId", handler.Room.GetRoomOfUserByGalleryId)
		}

		r.GET("/payment/:bookingId", handler.User.MakeBookingPayment)

		r.GET("/swagger/*any", ginSwagger.WrapHandler(swaggerFiles.Handler))
		r.Run()

		return nil
	},
}
