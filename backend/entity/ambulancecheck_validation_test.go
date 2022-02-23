package entity

import (
	"testing"
	"time"

	"github.com/asaskevich/govalidator"
	. "github.com/onsi/gomega"
)

func TestAmbulanceCheckPass(t *testing.T) {
	g := NewGomegaWithT(t)

	// ข้อมูลถูกต้องหมดทุก field
	ambulanceCheck := AmbulanceCheck{
		DateTime: time.Now(),
		DocCode:  "AAA123",
		Severity: 2,
		Note:     "This is a test",
	}
	// ตรวจสอบด้วย govalidator
	ok, err := govalidator.ValidateStruct(ambulanceCheck)

	// ok ต้องเป็น true แปลว่าไม่มี error
	g.Expect(ok).To(BeTrue())

	// err เป็นค่า nil แปลว่าไม่มี error
	g.Expect(err).To(BeNil())
}

func TestAmbulanceCheckDocCodeMatches(t *testing.T) {
	g := NewGomegaWithT(t)

	fixtures := []string{
		"",       // ว่าง
		"DADD34", // ตัวอักษรเกิน
		"123458", // ไม่มีตัวอักษร
		"D12379", //ตัวเลขเกิน
		"D1267",  //ตัวเลขไม่ครบ
		"D",      //ไม่มีตัวเลข
	}

	for _, fixture := range fixtures {
		ambulanceCheck := AmbulanceCheck{
			DateTime: time.Now(),
			DocCode:  fixture,
			Severity: 2,
			Note:     "This is a test",
		}
		// ตรวจสอบด้วย govalidator
		ok, err := govalidator.ValidateStruct(ambulanceCheck)

		// ok ต้องเป็น true แปลว่าไม่มี error
		g.Expect(ok).ToNot(BeTrue())

		// err เป็นค่า nil แปลว่าไม่มี error
		g.Expect(err).ToNot(BeNil())
	}
}

func TestAmbulanceCheckDatetimeMustBePresent(t *testing.T) {
	g := NewGomegaWithT(t)

	ambulanceCheck := AmbulanceCheck{
		DateTime: time.Now().Add((-29) * time.Hour), // ใส่วันที่ของเมื่อวาน
		DocCode:  "AAA123",
		Severity: 1,
		Note:     "This is a test",
	}
	// ตรวจสอบด้วย govalidator
	ok, err := govalidator.ValidateStruct(ambulanceCheck)

	// ok ต้องไม่เป็นค่า true แปลว่าต้องจับ error ได้
	g.Expect(ok).ToNot(BeTrue())

	// err ต้องไม่เป็นค่า nil แปลว่าต้องจับ error ได้
	g.Expect(err).ToNot(BeNil())

	// err.Error ต้องมี error message แสดงออกมา
	g.Expect(err.Error()).To(Equal("Time must be current date"))
}

func TestAmbulanceCheckSeverityInRange(t *testing.T) {
	g := NewGomegaWithT(t)

	ambulanceCheck := AmbulanceCheck{
		DateTime: time.Now(),
		DocCode:  "AAA123",
		Severity: 0,
		Note:     "This is a test",
	}

	// ตรวจสอบด้วย govalidator
	ok, err := govalidator.ValidateStruct(ambulanceCheck)

	// ok ต้องไม่เป็นค่า true แปลว่าต้องจับ error ได้
	g.Expect(ok).ToNot(BeTrue())

	// err ต้องไม่เป็นค่า nil แปลว่าต้องจับ error ได้
	g.Expect(err).ToNot(BeNil())

	// err.Error ต้องมี error message แสดงออกมา
	g.Expect(err.Error()).To(Equal("Level must be between 1-3"))
}
