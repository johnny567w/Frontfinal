import { ClienteOcasional } from "./cliente_ocasional.model";
import { Espacio } from "./espacio.model";
import { Vehiculo } from "./vehiculo.model";

export interface Ticket{
    id : Number,
    fechaEmision : Date,
    horaEntrada : Date,
    horaSalida : Date,
    montoTotal : Number,
    espacio : Espacio,
    vehiculo : Vehiculo,
    clienteOcasional : ClienteOcasional
}