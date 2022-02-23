package entity

import (
	"testing"
	"time"

	"github.com/asaskevich/govalidator"
	. "github.com/onsi/gomega"
)

// ถูกต้องทั้งหมด
func TestAmbulanceArrivalPass(t *testing.T) {
	g := NewGomegaWithT(t)

	ambulancearrival := AmbulanceArrival{
		Number_of_passenger: 1,
		Distance:            2.8,
		DateTime:            time.Now(),
	}

	// ตรวจสอบด้วย govalidator
	ok, err := govalidator.ValidateStruct(ambulancearrival)

	// ok ต้องเป็น true แปลว่าไม่มี error
	g.Expect(ok).To(BeTrue())

	// err เป็นค่า nil แปลว่าไม่มี error
	g.Expect(err).To(BeNil())

}

//ตรวจสอบค่าวันที่แล้วต้องเจอ Error
func TestAmbulanceArrivalDateMustBeToday(t *testing.T) {
	g := NewGomegaWithT(t)

	ambulancearrival := AmbulanceArrival{
		Number_of_passenger: 1,
		Distance:            2.8,
		DateTime:            time.Now().Add(24 * time.Hour), // อนาคต, fail
	}

	// ตรวจสอบด้วย govalidator
	ok, err := govalidator.ValidateStruct(ambulancearrival)

	// ok ต้องเป็น true แปลว่าไม่มี error
	g.Expect(ok).ToNot(BeTrue())

	// err เป็นค่า nil แปลว่าไม่มี error
	g.Expect(err).ToNot(BeNil())

	g.Expect(err.Error()).To(Equal("Ambulance Arrival must be current date"))
}

//ตรวจสอบค่าจำนวนคนที่นั่งกลับมาแล้วต้องเจอ Error
func TestAmbulanceArrivalNumberPatientBeInvalid(t *testing.T) {
	g := NewGomegaWithT(t)

	ambulancearrival := AmbulanceArrival{
		Number_of_passenger: -1, //ผิด
		Distance:            5.8,
		DateTime:            time.Now(),
	}

	ok, err := govalidator.ValidateStruct(ambulancearrival)

	// ok ต้องเป็น true แปลว่าไม่มี error
	g.Expect(ok).ToNot(BeTrue())

	// err เป็นค่า nil แปลว่าไม่มี error
	g.Expect(err).ToNot(BeNil())

	g.Expect(err.Error()).To(Equal("Number of passenger must be greater to zero"))

}

//ตรวจสอบค่าระยะทางแล้วต้องเจอ Error
func TestAmbulanceArrivalDistanceMustBeValid(t *testing.T) {
	g := NewGomegaWithT(t)

	ambulancearrival := AmbulanceArrival{
		Number_of_passenger: 1,
		Distance:            -9.8, // ผิด
		DateTime:            time.Now(),
	}

	// ตรวจสอบด้วย govalidator
	ok, err := govalidator.ValidateStruct(ambulancearrival)

	// ok ต้องเป็น true แปลว่าไม่มี error
	g.Expect(ok).ToNot(BeTrue())

	// err เป็นค่า nil แปลว่าไม่มี error
	g.Expect(err).ToNot(BeNil())

	g.Expect(err.Error()).To(Equal("Distance must be a positive decimal"))
}
