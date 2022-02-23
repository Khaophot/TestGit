package controller

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/sut64/team08/entity"
	"github.com/asaskevich/govalidator"
)

// POST /amnluncearrivals/:id
func CreateAmbulanceArrival(c *gin.Context) {

	var ambulancearrival entity.AmbulanceArrival
	var employee entity.Employee
	var patient entity.Patient
	var ambulanceonduty entity.AmbulanceOnDuty
	var ambulance entity.Ambulance

	// ผลลัพธ์ที่ได้จากขั้นตอนที่ 7 จะถูก bind เข้าตัวแปร ambulanceArrival
	if err := c.ShouldBindJSON(&ambulancearrival); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// 8: ค้นหา AmbulanceOnDuty ด้วย id
	if tx := entity.DB().Where("id = ?", ambulancearrival.AmbulanceOnDutyID).First(&ambulanceonduty); tx.RowsAffected == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "ambulanceOnDuty not found"})
		return
	}

	// 9: ค้นหา Patient ด้วย id
	if tx := entity.DB().Where("id = ?", ambulancearrival.PatientID).First(&patient); tx.RowsAffected == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "patient not found"})
		return
	}

	// 10: ค้นหา employe ด้วย id
	if tx := entity.DB().Where("id = ?", ambulancearrival.RecorderID).First(&employee); tx.RowsAffected == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "employee not found"})
		return
	}

	if tx := entity.DB().Model(&ambulance).Where(ambulanceonduty.AmbulanceID).Update("status_id", 1); tx.RowsAffected == 0{
		c.JSON(http.StatusBadRequest, gin.H{"error": "not found"})
		return
	}

	// 11: สร้าง AmbulanceArrival
	aa := entity.AmbulanceArrival{
		Number_of_passenger: ambulancearrival.Number_of_passenger,
		Distance:            ambulancearrival.Distance,
		DateTime:            ambulancearrival.DateTime.Local(),
		Recorder:            employee,        // โยงความสัมพันธ์กับ Entity Employee
		Patient:             patient,         // โยงความสัมพันธ์กับ Entity Patient
		AmbulanceOnDuty:     ambulanceonduty, // โยงความสัมพันธ์กับ Entity AmbulanceOnDuty ในตาราง AmbulanceArrival
	}

	//ขั้นตอนการ validate ที่นำมาจาก unit test
	if _, err := govalidator.ValidateStruct(aa); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	
	// 12: บันทึก
	if err := entity.DB().Create(&aa).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": aa})

}

// GET /amnluncearrival/:id
func GetAmbulanceArrival(c *gin.Context) {
	var ambulancearrival entity.AmbulanceArrival
	id := c.Param("id")
	if err := entity.DB().Preload("AmbulanceOnDuty").Preload("Patient").Preload("Recorder").Raw("SELECT * FROM ambulance_arrivals WHERE id = ?", id).Find(&ambulancearrival).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"data": ambulancearrival})
}

func ListAmbulanceArrivals(c *gin.Context) {
	var ambulancearrivals []entity.AmbulanceArrival
	if err := entity.DB().Preload("Recorder").Preload("Patient").Preload("AmbulanceOnDuty").Preload("AmbulanceOnDuty.Ambulance").Raw("SELECT * FROM ambulance_arrivals").Find(&ambulancearrivals).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": ambulancearrivals})
}

// Delete /amnluncearrivals/:id
func DeleteAmbulanceArrival(c *gin.Context) {
	id := c.Param("id")
	if tx := entity.DB().Exec("DELETE FROM ambulance_arrivals WHERE id = ?", id); tx.RowsAffected == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Ambulance Arrival not found"})
		return
	}
	c.JSON(http.StatusOK, gin.H{"data": id})
}

// PATCH /amnluncearrivals
func UpdateAmbulanceArrival(c *gin.Context) {
	var ambulancearrival entity.AmbulanceArrival
	if err := c.ShouldBindJSON(&ambulancearrival); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	if tx := entity.DB().Where("id = ?", ambulancearrival.ID).First(&ambulancearrival); tx.RowsAffected == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Ambulance Arrival not found"})
		return
	}
	if err := entity.DB().Save(&ambulancearrival).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"data": ambulancearrival})
}
