import { PatientInterface } from "./IPatient";
import { EmployeesInterface } from "./IEmployee";
import { IncidentsInterface } from "./IIncident";

export interface AssessmentInterface {

    ID: number,

    Symptom: string,
	SymptomLevel: number,
	Datetime:   Date,

	PatientID: number,
	Patient:   PatientInterface, 

	RecorderID: number,
	Recorder:   EmployeesInterface, 

	IncidentID: number,
	Incident:   IncidentsInterface;
}