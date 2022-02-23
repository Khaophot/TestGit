package entity

import (
	"testing"
	"time"

	"github.com/asaskevich/govalidator"
	. "github.com/onsi/gomega"
)

// ตรวจสอบค่าว่างของ อาการ แล้วต้องชเจอ Error
func TestSymptomNotBlank(t *testing.T) {
	g := NewGomegaWithT(t)

	assessment := Assessment{
		Symptom:      "",
		SymptomLevel: 2,
		Datetime:     time.Now(),
	}

	// ตรวจสอบด้วย govalidator
	ok, err := govalidator.ValidateStruct(assessment)

	// ok ต้องไม่เป็นค่า true แปลว่าต้องจับ error ได้
	g.Expect(ok).ToNot(BeTrue())

	// err ต้องไม่เป็นค่า nil แปลว่าต้องจับ error ได้
	g.Expect(err).ToNot(BeNil())

	// err.Error ต้องมี error message แสดงออกมา
	g.Expect(err.Error()).To(Equal("Please fill the symptom"))
}

func TestSymptomLevelInRange(t *testing.T) {
	g := NewGomegaWithT(t)

	assessment := Assessment{
		Symptom:      "headache",
		SymptomLevel: 0,
		Datetime:     time.Now(),
	}

	// ตรวจสอบด้วย govalidator
	ok, err := govalidator.ValidateStruct(assessment)

	// ok ต้องไม่เป็นค่า true แปลว่าต้องจับ error ได้
	g.Expect(ok).ToNot(BeTrue())

	// err ต้องไม่เป็นค่า nil แปลว่าต้องจับ error ได้
	g.Expect(err).ToNot(BeNil())

	// err.Error ต้องมี error message แสดงออกมา
	g.Expect(err.Error()).To(Equal("Level must be only (1-3)"))
}

func TestDatetimeMustBePresent(t *testing.T) {
	g := NewGomegaWithT(t)

	assessment := Assessment{
		Symptom:      "faint",
		SymptomLevel: 1,
		Datetime:     time.Now().Add((-26) * time.Hour), // ใส่วันที่ของเมื่อวาน
	}
	// ตรวจสอบด้วย govalidator
	ok, err := govalidator.ValidateStruct(assessment)

	// ok ต้องไม่เป็นค่า true แปลว่าต้องจับ error ได้
	g.Expect(ok).ToNot(BeTrue())

	// err ต้องไม่เป็นค่า nil แปลว่าต้องจับ error ได้
	g.Expect(err).ToNot(BeNil())

	// err.Error ต้องมี error message แสดงออกมา
	g.Expect(err.Error()).To(Equal("Please select current time"))
}
