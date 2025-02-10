import { Persona } from "./persona.model";
import { Usuario } from "./usuario.model";

export interface Vehiculo{
    id : number,
    placa : String,
    usuario : Persona
}