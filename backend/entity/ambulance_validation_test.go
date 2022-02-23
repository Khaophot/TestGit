package entity

import (
	"testing"
	"time"

	"github.com/asaskevich/govalidator"
	. "github.com/onsi/gomega"
)

func TestAmbulancePass(t *testing.T) {
	g := NewGomegaWithT(t)

	ami := Ambulance{
		CarNumber:    103,
		Registration: "กจ4412",
		DateTime:     time.Now(), // ถูก
	}

	// ตรวจสอบด้วย govalidator
	ok, err := govalidator.ValidateStruct(ami)

	// ok ต้องเป็น true แปลว่าไม่มี error
	g.Expect(ok).To(BeTrue())

	// err เป็นค่า nil แปลว่าไม่มี error
	g.Expect(err).To(BeNil())
}

func TestAmbulanceDateMustBeToday(t *testing.T) {
	g := NewGomegaWithT(t)

	ami := Ambulance{
		CarNumber:    102,
		Registration: "กจ2122",
		DateTime:     time.Now().Add(24 * time.Hour), // อนาคต, fail
	}

	// ตรวจสอบด้วย govalidator
	ok, err := govalidator.ValidateStruct(ami)

	// ok ต้องไม่เป็นค่า true แปลว่าต้องจับ error ได้
	g.Expect(ok).ToNot(BeTrue())

	// err ต้องไม่เป็นค่า nil แปลว่าต้องจับ error ได้
	g.Expect(err).ToNot(BeNil())

	// err.Error ต้องมี error message แสดงออกมา
	g.Expect(err.Error()).To(Equal("AmbulanceDate not true"))
}

func TestCarnumberMoreThanzero(t *testing.T) {
	g := NewGomegaWithT(t)

	ami := Ambulance{
		CarNumber:    0, //ผิด
		Registration: "กจ7771",
		DateTime:     time.Now(),
	}
	// ตรวจสอบด้วย govalidator
	ok, err := govalidator.ValidateStruct(ami)

	// ok ต้องไม่เป็นค่า true แปลว่าต้องจับ error ได้
	g.Expect(ok).ToNot(BeTrue())

	// err ต้องไม่เป็นค่า nil แปลว่าต้องจับ error ได้
	g.Expect(err).ToNot(BeNil())
}

func TestRegistrationMustBeInValidPattern(t *testing.T) {
	g := NewGomegaWithT(t)

	regis := []string{
		"6000",     // \d 4 ตัว
		"ก6666",    // ก ตามด้วย \d 4 ตัว
		"จบ 1",     // จบ ตามด้วย เว้นวรรค และ \d 1 ตัว
		"11กพ6544", // มีตัวเลขนำหน้ามากกว่า1ตำแหน่ง
		"2กพ6544",  // มีตัวเลขนำหน้าไม่ใช่เลข1
		"1rพ44",    // ใส่ตัวอักษรผิด ที่ไม่ใช่ ก-ฮ
		"บบ55555",  // /d 5 ตัว
		"867บย",    // สลับตำแหน่ง
	}

	for _, regis := range regis {
		ami := Ambulance{
			CarNumber:    102,
			Registration: regis, //ผิด
			DateTime:     time.Now(),
		}

		ok, err := govalidator.ValidateStruct(ami)

		// ok ต้องไม่เป็นค่า true แปลว่าต้องจับ error ได้
		g.Expect(ok).ToNot(BeTrue())

		// err ต้องไม่เป็นค่า nil แปลว่าต้องจับ error ได้
		g.Expect(err).ToNot(BeNil())

	}
}
