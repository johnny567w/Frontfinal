import { TipoHorario } from "./tipo_horario.model";

export interface Horario {
    id : Number,
    horaApertura : Date,
    horaCierre : Date,
    tipoHorario : TipoHorario
}