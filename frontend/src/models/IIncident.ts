import { EmployeesInterface } from "./IEmployee";
import { IllnessInterface } from "./IIllness";
import { UrgenciesInterface } from "./IUrgency";


export interface IncidentsInterface {

    ID: number,
    Title: string,
    Informer: string,
    Numberpatient: number,
    Location: string,
    Datetime: Date ,

    EmployeeID: number,
    Employee: EmployeesInterface,
    IllnessID: number,
    Illness: IllnessInterface,
    UrgencyID: number,
    Urgency: UrgenciesInterface,
}