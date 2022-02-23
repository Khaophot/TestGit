import { EmployeesInterface } from "./IEmployee";
import { PatientInterface } from "./IPatient";
import { AmbulanceOnDutyInterface } from "./IAmbulanceOnDuty";

export interface AmbulanceArrivalInterface {
    ID: number,
    Distance: number,
    Number_of_passenger: number,
    DateTime: Date,
    RecorderID:      number,
    Recorder:        EmployeesInterface,
    PatientID:      number,
    Patient:        PatientInterface,
    AmbulanceOnDutyID:      number,
    AmbulanceOnDuty:        AmbulanceOnDutyInterface,
  }