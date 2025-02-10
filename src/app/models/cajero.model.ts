import { Persona } from "./persona.model";

export interface Cajero {
    id : Number,
    sueldo : Number,
    fechaIngreso :Date,
    persona : Persona
}