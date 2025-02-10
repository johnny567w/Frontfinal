import { Persona } from "./persona.model";

export interface Usuario{
    id : Number,
    fechaRegistro : Date,
    persona : Persona
}