package controller

import (
	"testing"
	"time"

	"github.com/asaskevich/govalidator"
	. "github.com/onsi/gomega"
	"github.com/sut64/team08/entity"
)

func TestAmbulanceOnDutyPass(t *testing.T) {
	g := NewGomegaWithT(t)

	// ข้อมูลถูกต้องหมดทุก field
	ambulanceOnDuty := entity.AmbulanceOnDuty{
		Code:       "D12345678",
		OnDutyDate: time.Now(),
		Passenger:  2,
	}
	// ตรวจสอบด้วย govalidator
	ok, err := govalidator.ValidateStruct(ambulanceOnDuty)

	// ok ต้องเป็น true แปลว่าไม่มี error
	g.Expect(ok).To(BeTrue())

	// err เป็นค่า nil แปลว่าไม่มี error
	g.Expect(err).To(BeNil())
}

func TestAmbulanceOnDutyCodeNotBlank(t *testing.T) {
	g := NewGomegaWithT(t)

	ambulanceOnDuty := entity.AmbulanceOnDuty{
		Code:       "", //เป็นค่าว่าง ผิด
		OnDutyDate: time.Now(),
		Passenger:  2,
	}
	ok, err := govalidator.ValidateStruct(ambulanceOnDuty)

	g.Expect(ok).ToNot(BeTrue())

	g.Expect(err).ToNot(BeNil())

	g.Expect(err.Error()).To(Equal("Code must not be blank"))
}

func TestAmbulanceOnDutyCodeMatches(t *testing.T) {
	g := NewGomegaWithT(t)

	fixtures := []string{
		"A12345678",  // ตัวอักษรผิด
		"DA12345678", // ตัวอักษรเกิน
		"12345678",   // ไม่มีตัวอักษร

		"D123456789", //ตัวเลขเกิน
		"D1234567",   //ตัวเลขไม่ครบ
		"D",          //ไม่มีตัวเลข
	}

	for _, fixture := range fixtures {
		ambulanceOnDuty := entity.AmbulanceOnDuty{
			Code:       fixture,
			OnDutyDate: time.Now(),
			Passenger:  2,
		}
		ok, err := govalidator.ValidateStruct(ambulanceOnDuty)

		g.Expect(ok).ToNot(BeTrue())

		g.Expect(err).ToNot(BeNil())

		g.Expect(err.Error()).To(Equal("Code not matches 'Dxxxxxxxx' ex. D00000000"))
	}
}

func TestAmbulanceOnDutyDateToDay(t *testing.T) {
	g := NewGomegaWithT(t)

	ambulanceOnDuty := entity.AmbulanceOnDuty{
		Code:       "D12345678",
		OnDutyDate: time.Now().Add(50 * time.Hour), //วันที่ไม่เป็นปัจจุบัน ผิด
		Passenger:  2,
	}
	ok, err := govalidator.ValidateStruct(ambulanceOnDuty)

	g.Expect(ok).ToNot(BeTrue())

	g.Expect(err).ToNot(BeNil())

	g.Expect(err.Error()).To(Equal("Date must be today"))
}

func TestAmbulanceOnDutyPassengerNotZero(t *testing.T) {
	g := NewGomegaWithT(t)

	ambulanceOnDuty := entity.AmbulanceOnDuty{
		Code:       "D12345678",
		OnDutyDate: time.Now(),
		Passenger:  0, //ผู้โดยสารเป็น 0 ผิด
	}
	ok, err := govalidator.ValidateStruct(ambulanceOnDuty)

	g.Expect(ok).ToNot(BeTrue())

	g.Expect(err).ToNot(BeNil())

	g.Expect(err.Error()).To(Equal("Passenger must not be zero"))
}

func TestAmbulanceOnDutyPassengerNotNegative(t *testing.T) {
	g := NewGomegaWithT(t)

	ambulanceOnDuty := entity.AmbulanceOnDuty{
		Code:       "D12345678",
		OnDutyDate: time.Now(),
		Passenger:  -5, //ผู้โดยสารเป็น 0 ผิด
	}
	ok, err := govalidator.ValidateStruct(ambulanceOnDuty)

	g.Expect(ok).ToNot(BeTrue())

	g.Expect(err).ToNot(BeNil())

	g.Expect(err.Error()).To(Equal("Passenger must be greater than zero"))
}
