import { Horario } from "./horario.model"

export interface ExceptionHorario{
    id : Number,
    fecha : Date
    horaApertura : Date,
    horaCierre : Date,
    cierreTodoDia : boolean,
    horario : Horario
    
}