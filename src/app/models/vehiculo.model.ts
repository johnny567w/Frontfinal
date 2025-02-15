import { Persona } from "./persona.model";
import { Usuario } from "./usuario.model";

export interface Vehiculo{
    id: number | null
    placa : String,
    usuario : Persona
}