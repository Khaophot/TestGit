package controller

import (
	"net/http"

	"github.com/asaskevich/govalidator"
	"github.com/gin-gonic/gin"
	"github.com/sut64/team08/entity"
)

func CreateAmbulanceCheck(c *gin.Context) {

	var ambulancecheck entity.AmbulanceCheck
	var employee entity.Employee
	var ambulance entity.Ambulance
	var problem entity.Problem

	if err := c.ShouldBindJSON(&ambulancecheck); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	if tx := entity.DB().Where("id = ?", ambulancecheck.RecorderID).First(&employee); tx.RowsAffected == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "employee not found"})
		return
	}

	if tx := entity.DB().Where("id = ?", ambulancecheck.AmbulanceID).First(&ambulance); tx.RowsAffected == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "ambulance not found"})
		return
	}

	if tx := entity.DB().Where("id = ?", ambulancecheck.ProblemID).First(&problem); tx.RowsAffected == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "problem not found"})
		return
	}

	ac := entity.AmbulanceCheck{
		DateTime:  ambulancecheck.DateTime,
		Recorder:  employee,
		Ambulance: ambulance,
		Severity:  ambulancecheck.Severity,
		DocCode:   ambulancecheck.DocCode,
		Note:      ambulancecheck.Note,
		Problem:   problem,
	}

	if _, err := govalidator.ValidateStruct(ac); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	if err := entity.DB().Create(&ac).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"data": ac})
}

func GetAmbulanceCheck(c *gin.Context) {
	var ambulancecheck entity.AmbulanceCheck
	id := c.Param("id")
	if err := entity.DB().Preload("Recorder").Preload("Ambulance").Preload("Problem").Raw("SELECT * FROM ambulance_checks WHERE id = ?", id).Find(&ambulancecheck).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"data": ambulancecheck})
}

func ListAmbulanceChecks(c *gin.Context) {
	var ambulancechecks []entity.AmbulanceCheck
	if err := entity.DB().Preload("Recorder").Preload("Ambulance").Preload("Problem").Raw("SELECT * FROM ambulance_checks").Find(&ambulancechecks).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"data": ambulancechecks})
}

// func ListAmbulanceChecks(c *gin.Context) {
// 	var ambulancechecks []entity.AmbulanceCheck
// 	id := c.Param("employee_id")
// 	if err := entity.DB().Preload("Employee").Preload("Ambulance").Raw("SELECT * FROM ambulancechecks WHERE employee_id = ?", id).Find(&ambulancechecks).Error; err != nil {
// 		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
// 		return
// 	}

// 	c.JSON(http.StatusOK, gin.H{"data": ambulancechecks})
// }

func DeleteAmbulanceCheck(c *gin.Context) {
	id := c.Param("id")
	if tx := entity.DB().Exec("DELETE FROM ambulancechecks WHERE id = ?", id); tx.RowsAffected == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "ambulancecheck not found"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": id})
}

func UpdateAmbulanceCheck(c *gin.Context) {
	var ambulancecheck entity.AmbulanceCheck
	if err := c.ShouldBindJSON(&ambulancecheck); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	if tx := entity.DB().Where("id = ?", ambulancecheck.ID).First(&ambulancecheck); tx.RowsAffected == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "ambulancecheck not found"})
		return
	}

	if err := entity.DB().Save(&ambulancecheck).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": ambulancecheck})
}

// func ListReservationForRoomPayment(c *gin.Context) {
// 	var reservations []entity.Reservation
// 	if err := entity.DB().Raw("SELECT l.id, l.people, l.customer_id, l.room_id, l.payment_id FROM reservations l LEFT join room_payments r ON r.reservation_id = l.id WHERE r.id is NULL").Find(&reservations).Error; err != nil {
// 		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
// 		return
// 	}

// 	c.JSON(http.StatusOK, gin.H{"data": reservations})
// }
