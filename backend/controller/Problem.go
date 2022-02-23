package controller

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/sut64/team08/entity"
)

func CreateProblem(c *gin.Context) {
	var problem entity.Problem
	if err := c.ShouldBindJSON(&problem); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	if err := entity.DB().Create(&problem).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"data": problem})
}

func GetProblem(c *gin.Context) {
	var problem entity.Problem
	id := c.Param("id")
	if err := entity.DB().Raw("SELECT * FROM problems WHERE id = ?", id).Scan(&problem).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": problem})
}

func ListProblems(c *gin.Context) {
	var problems []entity.Problem
	if err := entity.DB().Raw("SELECT * FROM problems").Scan(&problems).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": problems})
}

func DeleteProblem(c *gin.Context) {
	id := c.Param("id")
	if tx := entity.DB().Exec("DELETE FROM problems WHERE id = ?", id); tx.RowsAffected == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "problem not found"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": id})
}

func UpdateProblem(c *gin.Context) {
	var problem entity.Problem
	if err := c.ShouldBindJSON(&problem); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	if tx := entity.DB().Where("id = ?", problem.ID).First(&problem); tx.RowsAffected == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "problem not found"})
		return
	}

	if err := entity.DB().Save(&problem).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": problem})
}
