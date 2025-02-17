import { Espacio } from "./espacio.model";
import { Persona } from "./persona.model";
import { Usuario } from "./usuario.model";

export interface Contrato{
    id : number,
    fechaInicio : Date,
    fechaFin : Date,
    montoTotal : number,
    usuario : Usuario,
    espacio : Espacio
}