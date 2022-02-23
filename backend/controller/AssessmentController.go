package controller

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/sut64/team08/entity"

	"github.com/asaskevich/govalidator"
)

func CreateAssessment(c *gin.Context) {
	var assessment entity.Assessment
	var patient entity.Patient
	var employee entity.Employee
	var incident entity.Incident

	if err := c.ShouldBindJSON(&assessment); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	if tx := entity.DB().Where("id = ?", assessment.PatientID).First(&patient); tx.RowsAffected == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Patient not found"})
		return
	}

	if tx := entity.DB().Where("id = ?", assessment.IncidentID).First(&incident); tx.RowsAffected == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Incident not found"})
		return
	}

	if tx := entity.DB().Where("id = ?", assessment.RecorderID).First(&employee); tx.RowsAffected == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Recorder not found"})
		return
	}

	// สร้าง Assessment
	as := entity.Assessment{
		Patient:      patient,
		Incident:     incident,
		Recorder:     employee,
		Symptom:      assessment.Symptom,
		SymptomLevel: assessment.SymptomLevel,
		Datetime:     assessment.Datetime,
	}

	// Validation part
	if _, err := govalidator.ValidateStruct(as); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	if err := entity.DB().Create(&as).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": as})
}

func GetAssessment(c *gin.Context) {
	var assessment entity.Assessment
	id := c.Param("id")
	if err := entity.DB().Raw("SELECT * FROM assessments WHERE id = ?", id).Scan(&assessment).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"data": assessment})
}

func ListAssessment(c *gin.Context) {
	var assessment []entity.Assessment
	if err := entity.DB().Raw("SELECT * FROM assessments").Scan(&assessment).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"data": assessment})
}

func DeleteAssessment(c *gin.Context) {
	id := c.Param("id")
	if tx := entity.DB().Exec("DELETE FROM assessments WHERE id = ?", id); tx.RowsAffected == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "assessment not found"})
		return
	}
	c.JSON(http.StatusOK, gin.H{"data": id})
}

func UpdateAssessment(c *gin.Context) {
	var assessment entity.Assessment
	if err := c.ShouldBindJSON(&assessment); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	if tx := entity.DB().Where("id = ?", assessment.ID).First(&assessment); tx.RowsAffected == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "assessment not found"})
		return
	}
	if err := entity.DB().Save(&assessment).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"data": assessment})
}
