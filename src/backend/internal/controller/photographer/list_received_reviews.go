package photographer

import (
	// "github.com/Roongkun/software-eng-ii/internal/controller/util"
	"github.com/gin-gonic/gin"
)

func (r *Resolver) ListReceivedReviews(c *gin.Context) {
	// photographer, ok := getPhotographer(c)
	// if !ok {
	// 	return
	// }

	// // find all galleries that belong to this photographer -> get galleryId
	// allGalleries, err := r.GalleryUsecase.FindByPhotographerId(c, photographer.Id)
	// if err != nil {
	// 	util.Raise500Error(c, err)
	// 	return
	// }

	// HOW TO DO:
	// 1. add FindByGalleryId function in postgres>booking THISSSS
	// then, find all bookings that belong to each gallery -> get bookingId
	// then, find all reviews that belong to each booking
	// (need to add FindByBookingId function in postgres>review)

	// easier way, but is it a good way??
	// OR 2. add attribute galleryId in review table
	// then, find all reviews that belong to each gallery
	// (need to add FindByGalleryId function in postgres>review)
	// if this way: handler.User.ListGalleryReviews can also use FindByGallery function.

	// c.JSON(http.StatusOK, gin.H{
	// 	"status": "success",
	// 	"data":   allReviews,
	// })
}
