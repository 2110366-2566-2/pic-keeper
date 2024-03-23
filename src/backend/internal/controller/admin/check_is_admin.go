package admin

import (
	"github.com/Roongkun/software-eng-ii/internal/controller/util"
	"github.com/Roongkun/software-eng-ii/internal/model"
	"github.com/gin-gonic/gin"
)

func checkIsAdmin(user model.User, c *gin.Context) bool {
	if !user.IsAdmin {
		util.Raise401Error(c, "only administrators are allowed to use this function")
		return false
	}
	return true
}
