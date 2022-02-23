import { AmbulancesInterface } from "./IAmbulance";
import { EmployeesInterface } from "./IEmployee";
import { ProblemsInterface } from "./IProblem";

export interface AmbulanceChecksInterface {
    ID: number, 
    DateTime: Date,
    DocCode: string,
    Severity: number,
    Note: string,

    AmbulanceID: number,
    Ambulance: AmbulancesInterface,

    RecorderID: number,
    Recorder: EmployeesInterface,

    ProblemID: number,
    Problem: ProblemsInterface,
}