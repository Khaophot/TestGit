package entity

import (
	"testing"
	"time"

	"github.com/asaskevich/govalidator"
	. "github.com/onsi/gomega"
)

func TestIncidentNegative(t *testing.T) {
	g := NewGomegaWithT(t)

	incident := Incident{
		Title:         "", // ต้องไม่ว่าง
		Informer:      "นายธนพล  ปักโคทานัง",
		Numberpatient: 3,
		Location:      "หน้าประตู 1 มทส",
		Datetime:      time.Now(),
	}

	ok, err := govalidator.ValidateStruct(incident)

	g.Expect(ok).ToNot(BeTrue())
	g.Expect(err).ToNot(BeNil())

	g.Expect(err.Error()).To(Equal("Title cannot be blank"))
}
