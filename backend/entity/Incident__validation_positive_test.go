package entity

import (
	"testing"
	"time"

	"github.com/asaskevich/govalidator"
	. "github.com/onsi/gomega"
)

func TestIncidentPositive(t *testing.T) {
	g := NewGomegaWithT(t)

	incident := Incident{
		Title:         "มีคนได้รับบาดเจ็บ",
		Informer:      "นายธนพล  ปักโคทานัง",
		Numberpatient: 3,
		Location:      "หน้าประตู 1 มทส",
		Datetime:      time.Now(),
	}

	ok, err := govalidator.ValidateStruct(incident)

	g.Expect(ok).To(BeTrue())
	g.Expect(err).To(BeNil())
}
