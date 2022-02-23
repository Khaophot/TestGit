package controller

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/sut64/team08/entity"
)

// GET /illnesses
func ListIllnesses(c *gin.Context) {
	var illnesses []entity.Illness
	if err := entity.DB().Raw("SELECT * FROM illnesses").Scan(&illnesses).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": illnesses})
}

// // POST /illnesses
// func CreateIllness(c *gin.Context) {
// 	var illness entity.Illness
// 	if err := c.ShouldBindJSON(&illness); err != nil {
// 		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
// 		return
// 	}

// 	if err := entity.DB().Create(&illness).Error; err != nil {
// 		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
// 		return
// 	}
// 	c.JSON(http.StatusOK, gin.H{"data": illness})
// }

// GET /illness/:id
// func GetIllness(c *gin.Context) {
// 	var illness entity.Illness
// 	id := c.Param("id")
// 	if err := entity.DB().Raw("SELECT * FROM illnesses WHERE id = ?", id).Scan(&illness).Error; err != nil {
// 		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
// 		return
// 	}

// 	c.JSON(http.StatusOK, gin.H{"data": illness})
// }

// GET /illnesses

// // DELETE /illnesses/:id
// func DeleteIllness(c *gin.Context) {
// 	id := c.Param("id")
// 	if tx := entity.DB().Exec("DELETE FROM illnesses WHERE id = ?", id); tx.RowsAffected == 0 {
// 		c.JSON(http.StatusBadRequest, gin.H{"error": "illness not found"})
// 		return
// 	}

// 	c.JSON(http.StatusOK, gin.H{"data": id})
// }

// // PATCH /illnesses
// func UpdateIllness(c *gin.Context) {
// 	var illness entity.Illness
// 	if err := c.ShouldBindJSON(&illness); err != nil {
// 		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
// 		return
// 	}

// 	if tx := entity.DB().Where("id = ?", illness.ID).First(&illness); tx.RowsAffected == 0 {
// 		c.JSON(http.StatusBadRequest, gin.H{"error": "illness not found"})
// 		return
// 	}

// 	if err := entity.DB().Save(&illness).Error; err != nil {
// 		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
// 		return
// 	}

// 	c.JSON(http.StatusOK, gin.H{"data": illness})
// }
