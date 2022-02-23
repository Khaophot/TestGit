package controller

import (
	"net/http"

	"github.com/asaskevich/govalidator"
	"github.com/gin-gonic/gin"
	"github.com/sut64/team08/entity"
)

func CreateAmbulanceOnDuty(c *gin.Context) {
	var AmbulanceOnDuty entity.AmbulanceOnDuty
	var Employee entity.Employee
	var Incident entity.Incident
	var Ambulance entity.Ambulance

	if err := c.ShouldBindJSON(&AmbulanceOnDuty); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	if tx := entity.DB().Where("id = ?", AmbulanceOnDuty.RecorderID).First(&Employee); tx.RowsAffected == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Recodrder not found"})
		return
	}

	if tx := entity.DB().Where("id = ?", AmbulanceOnDuty.AmbulanceID).First(&Ambulance); tx.RowsAffected == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Ambulance not found"})
		return
	}

	if tx := entity.DB().Where("id = ?", AmbulanceOnDuty.IncidentID).First(&Incident); tx.RowsAffected == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Incident not found"})
		return
	}

	AOD := entity.AmbulanceOnDuty{
		Code:       AmbulanceOnDuty.Code,
		Incident:   Incident,
		Ambulance:  Ambulance,
		OnDutyDate: AmbulanceOnDuty.OnDutyDate,
		Passenger:  AmbulanceOnDuty.Passenger,
		Recorder:   Employee,
	}

	if _, err := govalidator.ValidateStruct(AOD); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	if err := entity.DB().Create(&AOD).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	id := c.Param("id")

	if err := entity.DB().Exec("UPDATE ambulances SET status_id = 2 WHERE id = ?", id); err.RowsAffected == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "AmbulanceOnDuty not found"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": AOD})
}

func GetAmbulanceOnDuty(c *gin.Context) {
	var AmbulanceOnDuty entity.AmbulanceOnDuty

	id := c.Param("id")

	if err := entity.DB().Raw("SELECT * FROM ambulance_on_dutys WHERE id = ?", id).Scan(&AmbulanceOnDuty).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": AmbulanceOnDuty})
}

func ListAmbulanceOnDutys(c *gin.Context) {
	var AmbulanceOnDutys []entity.AmbulanceOnDuty

	if err := entity.DB().Preload("Ambulance").Preload("Recorder").Preload("Incident").Raw("SELECT * FROM ambulance_on_duties").Find(&AmbulanceOnDutys).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": AmbulanceOnDutys})
}

func DeleteAmbulanceOnDuty(c *gin.Context) {
	id := c.Param("id")

	if tx := entity.DB().Exec("DELETE FROM ambulance_on_dutys WHERE id = ?", id); tx.RowsAffected == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "AmbulanceOnDuty not found"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": id})
}

func ListAmbulancesForOnDuty(c *gin.Context) {
	var Ambulances []entity.Ambulance

	if err := entity.DB().Preload("AmbulanceType").Preload("Status").Preload("Employee").Raw("SELECT * FROM ambulances where status_id = 1").Find(&Ambulances).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": Ambulances})
}

func ListAmbulanceOnDutyAmbulance(c *gin.Context) {
	var ambulanceonduty []entity.AmbulanceOnDuty
	if err := entity.DB().Preload("Ambulance").Preload("Recorder").Preload("Incident").Raw("SELECT aod.id, aod.ambulance_id, aod.ambulance_id, aod.recorder_id, aod.on_duty_date, aod.incident_id, aod.code, aod.passenger FROM ambulance_on_duties aod LEFT JOIN ambulance_arrivals aa ON aod.id = aa.ambulance_on_duty_id WHERE aa.ambulance_on_duty_id is NULL").Find(&ambulanceonduty).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"data": ambulanceonduty})
}
