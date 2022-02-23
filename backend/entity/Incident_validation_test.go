package entity

import (
	"testing"
	"time"

	"github.com/asaskevich/govalidator"
	. "github.com/onsi/gomega"
)

func TestIncidentPass(t *testing.T) {
	g := NewGomegaWithT(t)

	// ข้อมูลถูกต้องทั้งหมดทุก field yes
	incident := Incident{
		Title:         "QWE",
		Informer:      "AAA",
		Numberpatient: 1,
		Location:      "BBB",
		Datetime:      time.Now(),
	}

	//ตรวจสอบด้วย gobalidator
	ok, err := govalidator.ValidateStruct(incident)

	// ok เป็น ture แปลว่าไม่ error
	g.Expect(ok).To(BeTrue())

	// err เป็น nil แปลว่าไม่มี error
	g.Expect(err).To(BeNil())
}

func TestIncidentTitleNotBlank(t *testing.T) {
	g := NewGomegaWithT(t)

	incident := Incident{
		Title:         "", //ว่างเปล่า, ผิด
		Informer:      "AAA",
		Numberpatient: 1,
		Location:      "BBB",
		Datetime:      time.Now(),
	}

	//ตรวจสอบด้วย gobalidator
	ok, err := govalidator.ValidateStruct(incident)

	// ok ไม่เป็น ture แปลว่าต้องจับ error ได้
	g.Expect(ok).ToNot(BeTrue())

	// err ไม่เป็น nil แปลว่าต้องจับ error ได้
	g.Expect(err).ToNot(BeNil())

	g.Expect(err.Error()).To(Equal("Title cannot be blank"))
}

func TestIncidentInformerNotBlank(t *testing.T) {
	g := NewGomegaWithT(t)

	incident := Incident{
		Title:         "Benza",
		Informer:      "", //wrong
		Numberpatient: 1,
		Location:      "BBB",
		Datetime:      time.Now(),
	}

	//ตรวจสอบด้วย gobalidator
	ok, err := govalidator.ValidateStruct(incident)

	// ok ไม่เป็น ture แปลว่าต้องจับ error ได้
	g.Expect(ok).ToNot(BeTrue())

	// err ไม่เป็น nil แปลว่าต้องจับ error ได้
	g.Expect(err).ToNot(BeNil())

	g.Expect(err.Error()).To(Equal("Informer cannot be blank"))
}

func TestIncidentNumberpatientNotZero(t *testing.T) {
	g := NewGomegaWithT(t)

	incident := Incident{
		Title:         "TTTTT",
		Informer:      "AAA",
		Numberpatient: 0, // ผิด
		Location:      "BBB",
		Datetime:      time.Now(),
	}

	//ตรวจสอบด้วย gobalidator
	ok, err := govalidator.ValidateStruct(incident)

	// ok ไม่เป็น ture แปลว่าต้องจับ error ได้
	g.Expect(ok).ToNot(BeTrue())

	// err ไม่เป็น nil แปลว่าต้องจับ error ได้
	g.Expect(err).ToNot(BeNil())

	g.Expect(err.Error()).To(Equal("Numberpatient cannot be Zero"))
}

func TestIncidentNumberpatientNotNegative(t *testing.T) {
	g := NewGomegaWithT(t)

	incident := Incident{
		Title:         "TTTTT",
		Informer:      "AAA",
		Numberpatient: -1, // ผิด...
		Location:      "BBB",
		Datetime:      time.Now(),
	}

	//ตรวจสอบด้วย gobalidator
	ok, err := govalidator.ValidateStruct(incident)

	// ok ไม่เป็น ture แปลว่าต้องจับ error ได้
	g.Expect(ok).ToNot(BeTrue())

	// err ไม่เป็น nil แปลว่าต้องจับ error ได้
	g.Expect(err).ToNot(BeNil())

	g.Expect(err.Error()).To(Equal("Numberpatient cannot be Negative"))
}

func TestIncidentLocationNotBlank(t *testing.T) {
	g := NewGomegaWithT(t)

	incident := Incident{
		Title:         "Benz007",
		Informer:      "QWER",
		Numberpatient: 1,
		Location:      "", //wrong
		Datetime:      time.Now(),
	}

	//ตรวจสอบด้วย gobalidator
	ok, err := govalidator.ValidateStruct(incident)

	// ok ไม่เป็น ture แปลว่าต้องจับ error ได้
	g.Expect(ok).ToNot(BeTrue())

	// err ไม่เป็น nil แปลว่าต้องจับ error ได้
	g.Expect(err).ToNot(BeNil())

	g.Expect(err.Error()).To(Equal("Location cannot be blank"))
}

func TestIncidentDateHaveMushPresent(t *testing.T) {
	g := NewGomegaWithT(t)

	incident := Incident{
		Title:         "TTTTT",
		Informer:      "AAA",
		Numberpatient: 4,
		Location:      "BBB",
		Datetime:      time.Now().Add(-29 * time.Hour), // อดีต or อนาคต, fail
	}

	//ตรวจสอบด้วย gobalidator
	ok, err := govalidator.ValidateStruct(incident)

	// ok ไม่เป็น ture แปลว่าต้องจับ error ได้
	g.Expect(ok).ToNot(BeTrue())

	// err ไม่เป็น nil แปลว่าต้องจับ error ได้
	g.Expect(err).ToNot(BeNil())

	g.Expect(err.Error()).To(Equal("DateTime must be present"))
}
