import { StatusesInterface } from "./IStatus";
import { AmbulanceTypesInterface } from "./IAmbulanceType";
import { EmployeesInterface } from "./IEmployee";
import internal from "stream";


export interface AmbulancesInterface {
  ID: number,
  DateTime: Date,
  CarNumber: number,
  Registration: string,

  StatusID: number,
  Status: StatusesInterface,
  AmbulanceTypeID: number,
  AmbulanceType:   AmbulanceTypesInterface,
  EmployeeID: number,
  Employee: EmployeesInterface,
}
