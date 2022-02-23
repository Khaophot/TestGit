package controller

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/sut64/team08/entity"
)

// GET /urgencies
func ListUrgencies(c *gin.Context) {
	var urgencies []entity.Urgency
	if err := entity.DB().Raw("SELECT * FROM urgencies").Scan(&urgencies).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": urgencies})
}

// // POST /urgencies
// func CreateUrgency(c *gin.Context) {
// 	var urgency entity.Urgency
// 	if err := c.ShouldBindJSON(&urgency); err != nil {
// 		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
// 		return
// 	}

// 	if err := entity.DB().Create(&urgency).Error; err != nil {
// 		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
// 		return
// 	}
// 	c.JSON(http.StatusOK, gin.H{"data": urgency})
// }

// // GET /urgency/:id
// func GetUrgency(c *gin.Context) {
// 	var urgency entity.Urgency
// 	id := c.Param("id")
// 	if err := entity.DB().Raw("SELECT * FROM urgencies WHERE id = ?", id).Scan(&urgency).Error; err != nil {
// 		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
// 		return
// 	}

// 	c.JSON(http.StatusOK, gin.H{"data": urgency})
// }

// // DELETE /urgencies/:id
// func DeleteUrgency(c *gin.Context) {
// 	id := c.Param("id")
// 	if tx := entity.DB().Exec("DELETE FROM urgencies WHERE id = ?", id); tx.RowsAffected == 0 {
// 		c.JSON(http.StatusBadRequest, gin.H{"error": "urgency not found"})
// 		return
// 	}

// 	c.JSON(http.StatusOK, gin.H{"data": id})
// }

// // PATCH /urgencies
// func UpdateUrgency(c *gin.Context) {
// 	var urgency entity.Urgency
// 	if err := c.ShouldBindJSON(&urgency); err != nil {
// 		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
// 		return
// 	}

// 	if tx := entity.DB().Where("id = ?", urgency.ID).First(&urgency); tx.RowsAffected == 0 {
// 		c.JSON(http.StatusBadRequest, gin.H{"error": "urgency not found"})
// 		return
// 	}

// 	if err := entity.DB().Save(&urgency).Error; err != nil {
// 		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
// 		return
// 	}

// 	c.JSON(http.StatusOK, gin.H{"data": urgency})
// }
