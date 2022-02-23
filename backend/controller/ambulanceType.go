package controller

import (
	"github.com/sut64/team08/entity"

	"github.com/gin-gonic/gin"

	"net/http"
)

// POST /users

func CreateAmbulanceType(c *gin.Context) {

	var ambulancetype entity.AmbulanceType

	if err := c.ShouldBindJSON(&ambulancetype); err != nil {

		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})

		return

	}

	if err := entity.DB().Create(&ambulancetype).Error; err != nil {

		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})

		return

	}

	c.JSON(http.StatusOK, gin.H{"data": ambulancetype})

}

// GET /user/:id

func GetAmbulanceType(c *gin.Context) {

	var ambulancetype entity.AmbulanceType

	id := c.Param("id")

	if err := entity.DB().Raw("SELECT * FROM ambulance_types WHERE id = ?", id).Scan(&ambulancetype).Error; err != nil {

		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})

		return

	}

	c.JSON(http.StatusOK, gin.H{"data": ambulancetype})

}

// GET /users

func ListAmbulancesTypes(c *gin.Context) {

	var ambulancestypes []entity.AmbulanceType

	if err := entity.DB().Raw("SELECT * FROM ambulance_types").Scan(&ambulancestypes).Error; err != nil {

		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})

		return

	}

	c.JSON(http.StatusOK, gin.H{"data": ambulancestypes})

}

// DELETE /users/:id

func DeleteAmbulanceType(c *gin.Context) {

	id := c.Param("id")

	if tx := entity.DB().Exec("DELETE FROM ambulance_types WHERE id = ?", id); tx.RowsAffected == 0 {

		c.JSON(http.StatusBadRequest, gin.H{"error": "ambulancetyp not found"})

		return

	}

	c.JSON(http.StatusOK, gin.H{"data": id})

}

// PATCH /users

func UpdateAmbulanceType(c *gin.Context) {

	var ambulancetypes entity.AmbulanceType

	if err := c.ShouldBindJSON(&ambulancetypes); err != nil {

		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})

		return

	}

	if tx := entity.DB().Where("id = ?", ambulancetypes.ID).First(&ambulancetypes); tx.RowsAffected == 0 {

		c.JSON(http.StatusBadRequest, gin.H{"error": "ambulancetyp not found"})

		return

	}

	if err := entity.DB().Save(&ambulancetypes).Error; err != nil {

		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})

		return

	}

	c.JSON(http.StatusOK, gin.H{"data": ambulancetypes})

}
