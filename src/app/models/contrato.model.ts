import { Espacio } from "./espacio.model";
import { Usuario } from "./usuario.model";

export interface Contrato{
    id : Number,
    fechaInicio : Date,
    fechFin : Date,
    montoTotal : Number,
    usuario : Usuario,
    espacio : Espacio
}