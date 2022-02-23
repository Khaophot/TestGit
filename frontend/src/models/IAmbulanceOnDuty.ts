import { EmployeesInterface } from "./IEmployee";
import { AmbulancesInterface } from "./IAmbulance";
import { IncidentsInterface } from "./IIncident";

export interface AmbulanceOnDutyInterface {
  ID: number,
  Code: string,
  OnDutyDate: Date,
  Passenger: number,
  RecorderID: number,
  Recorder: EmployeesInterface,
  AmbulanceID: number,
  Ambulance: AmbulancesInterface,
  IncidentID: number,
  Incident: IncidentsInterface,
}