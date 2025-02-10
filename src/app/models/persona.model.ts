import { Rol } from "./rol.model"

export interface Persona{
    id : Number,
    nombre : String,
    apellido : String,
    cedula : String,
    correo : String,
    password : String,
    fechaNacimiento : Date,
    telefono : String,
    direccion : String,
    estado : String,
    genero : String
    rol : Rol
}