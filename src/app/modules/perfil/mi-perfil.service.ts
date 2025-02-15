import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Persona } from '../../models/persona.model';
import { Vehiculo } from '../../models/vehiculo.model';

@Injectable({
  providedIn: 'root'
})
export class MiPerfilService {
  private personaUrl = 'http://localhost:8080/api/personas';
  private vehiculosUrl = 'http://localhost:8080/api/vehiculos';

  constructor(private http: HttpClient) {}

  getPerfilUsuario(id: number): Observable<Persona> {
    return this.http.get<Persona>(`${this.personaUrl}/${id}`);
  }

  actualizarPerfil(persona: Persona): Observable<Persona> {
    const { estado, rol, ...editableFields } = persona;
    return this.http.put<Persona>(`${this.personaUrl}`, editableFields);
  }

  getVehiculosUsuario(usuarioId: number): Observable<Vehiculo[]> {
    return this.http.get<Vehiculo[]>(`${this.vehiculosUrl}/usuario/${usuarioId}`);
  }

  agregarVehiculo(vehiculo: Vehiculo): Observable<Vehiculo> {
    return this.http.post<Vehiculo>(this.vehiculosUrl, vehiculo);
  }

  eliminarVehiculo(id: number): Observable<void> {
    return this.http.delete<void>(`${this.vehiculosUrl}/${id}`);
  }
  
}
