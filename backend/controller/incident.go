package controller

import (
	"net/http"

	"github.com/asaskevich/govalidator"
	"github.com/gin-gonic/gin"
	"github.com/sut64/team08/entity"
)

// POST /incidents
func CreateIncident(c *gin.Context) {

	var incident entity.Incident
	var employee entity.Employee
	var illness entity.Illness
	var urgency entity.Urgency

	// ผลลัพธ์ที่ได้จากขั้นตอนที่  จะถูก bind เข้าตัวแปร incident
	if err := c.ShouldBindJSON(&incident); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// : ค้นหา Employee ด้วย ID
	if tx := entity.DB().Where("id = ?", incident.EmployeeID).First(&employee); tx.RowsAffected == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "employee not found"})
		return
	}

	// : ค้นหา Illness ด้วย ID
	if tx := entity.DB().Where("id = ?", incident.IllnessID).First(&illness); tx.RowsAffected == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "illness not found"})
		return
	}

	// : ค้นหา Urgency ด้วย ID
	if tx := entity.DB().Where("id = ?", incident.UrgencyID).First(&urgency); tx.RowsAffected == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "urgency not found"})
		return
	}

	// : สร้าง Incident
	ic := entity.Incident{
		Title:         incident.Title,            // ได้หัวข้อ
		Informer:      incident.Informer,         // ได้ชื่อผู้แจ้ง
		Numberpatient: incident.Numberpatient,    // ได้ตัวเลขจำนวนคาดการณ์ผู้ป่วย
		Location:      incident.Location,         // ได้ Location
		Employee:      employee,                  // โยงความสัมพันธ์กับ Entity employee
		Illness:       illness,                   // โยงความสัมพันธ์กับ Entity illness
		Urgency:       urgency,                   // โยงความสัมพันธ์กับ Entity Urgency
		Datetime:      incident.Datetime.Local(), // ตั้งค่าฟิลด์ Datetime
	}

	// ขั้นตอนการ validate ที่นำมาจาก unit test
	if _, err := govalidator.ValidateStruct(ic); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// : บันทึก
	if err := entity.DB().Create(&ic).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"data": ic})
}

// List /incidents
func ListIncidents(c *gin.Context) {
	var incidents []entity.Incident
	if err := entity.DB().Preload("Employee").Preload("Illness").Preload("Urgency").Raw("SELECT * FROM incidents").Find(&incidents).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": incidents})
}
