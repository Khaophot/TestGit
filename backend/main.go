package main

import (
	"github.com/sut64/team08/controller"

	"github.com/sut64/team08/entity"
	"github.com/sut64/team08/middlewares"

	"github.com/gin-gonic/gin"
)

func main() {
	entity.SetupDatabase()

	r := gin.Default()
	r.Use(CORSMiddleware())

	api := r.Group("")
	{
		protected := api.Use(middlewares.Authorizes())
		{
			// Ambulance Routes
			protected.GET("/ambulances", controller.ListAmbulances)
			protected.GET("/ambulances/:id", controller.GetAmbulance)
			protected.POST("/ambulances", controller.CreateAmbulance)
			protected.PATCH("/ambulances", controller.UpdateAmbulance)
			protected.DELETE("/ambulances/:id", controller.DeleteAmbulance)

			// Customer Routes
			protected.GET("/statuses", controller.ListStatuses)
			protected.GET("/status/:id", controller.GetStatus)
			protected.POST("/statuses", controller.CreateStatus)
			protected.PATCH("/statuses", controller.UpdateStatus)
			protected.DELETE("/statuses/:id", controller.DeleteStatus)

			// RoomPayment Routes
			protected.GET("/ambulancetypes", controller.ListAmbulancesTypes)
			protected.GET("/ambulancetype/:id", controller.GetAmbulanceType)
			protected.POST("/ambulancetypes", controller.CreateAmbulanceType)
			protected.PATCH("/ambulancetypes", controller.UpdateAmbulanceType)
			protected.DELETE("/ambulancetypes/:id", controller.DeleteAmbulanceType)

			// Employee Routes
			protected.GET("/employees", controller.ListEmployees)
			protected.GET("/employee/:id", controller.GetEmployee)
			//protected.POST("/employees", controller.CreateEmployee)
			protected.PATCH("/employees", controller.UpdateEmployee)
			protected.DELETE("/employees/:id", controller.DeleteEmployee)

			// AmbulanceArrival Routes
			protected.GET("/ambulancearrivals", controller.ListAmbulanceArrivals)
			protected.GET("/ambulancearrival/:id", controller.GetAmbulanceArrival)
			protected.POST("/ambulancearrivals", controller.CreateAmbulanceArrival)
			protected.PATCH("/ambulancearrivals", controller.UpdateAmbulanceArrival)
			protected.DELETE("/ambulancearrivals/:id", controller.DeleteAmbulanceArrival)

			// AmbulanceOnDuty Routes
			protected.GET("/ambulanceonduties", controller.ListAmbulanceOnDutys)
			protected.GET("/amnlunceonduty/:id", controller.GetAmbulanceOnDuty)
			protected.GET("/ambulanceonduties/ambulance", controller.ListAmbulanceOnDutyAmbulance)
			protected.POST("/ambulanceonduties/:id", controller.CreateAmbulanceOnDuty)
			protected.DELETE("/ambulanceonduty/:id", controller.DeleteAmbulanceOnDuty)
			protected.GET("/ambulancesForOnDuty", controller.ListAmbulancesForOnDuty)

			// Patient Routes
			protected.GET("/patients", controller.ListPatients)
			protected.GET("/patient/:id", controller.GetPatient)
			//protected.POST("/patients", controller.CreatePatient)
			protected.PATCH("/patients", controller.UpdatePatient)
			protected.DELETE("/patients/:id", controller.DeletePatient)
			// Illnesses Routes
			protected.GET("/illnesses", controller.ListIllnesses)
			// Incident Routes
			protected.POST("/incidents", controller.CreateIncident)
			protected.GET("/incidents", controller.ListIncidents)
			// Urgency Routes
			protected.GET("/urgencies", controller.ListUrgencies)

			// Assessment Routes
			protected.GET("/assessments", controller.ListAssessment)
			protected.GET("/assessment/:id", controller.GetAssessment)
			protected.POST("/assessments", controller.CreateAssessment)
			protected.PATCH("/assessments", controller.UpdateAssessment)
			protected.DELETE("/assessments/:id", controller.DeleteAssessment)
			// AmbulanceCheck Routes
			protected.GET("/ambulancechecks", controller.ListAmbulanceChecks)
			protected.GET("/ambulancecheck/:id", controller.GetAmbulanceCheck)
			protected.POST("/ambulancechecks", controller.CreateAmbulanceCheck)
			protected.PATCH("/ambulancechecks", controller.UpdateAmbulanceCheck)
			protected.DELETE("/ambulancechecks/:id", controller.DeleteAmbulanceCheck)

			// Problem Routes
			protected.GET("/problems", controller.ListProblems)
			protected.GET("/problem/:id", controller.GetProblem)
			protected.POST("/problems", controller.CreateProblem)
			protected.PATCH("/problems", controller.UpdateProblem)
			protected.DELETE("/problems/:id", controller.DeleteProblem)

		}
	}

	// emp Routes
	r.POST("/employees", controller.CreateEmployee)

	// Authentication Routes
	r.POST("/login", controller.Login)

	// Run the server
	r.Run()
}

func CORSMiddleware() gin.HandlerFunc {
	return func(c *gin.Context) {
		c.Writer.Header().Set("Access-Control-Allow-Origin", "*")
		c.Writer.Header().Set("Access-Control-Allow-Credentials", "true")
		c.Writer.Header().Set("Access-Control-Allow-Headers", "Content-Type, Content-Length, Accept-Encoding, X-CSRF-Token, Authorization, accept, origin, Cache-Control, X-Requested-With")
		c.Writer.Header().Set("Access-Control-Allow-Methods", "POST, OPTIONS, GET, PUT")

		if c.Request.Method == "OPTIONS" {
			c.AbortWithStatus(204)
			return
		}

		c.Next()
	}
}
