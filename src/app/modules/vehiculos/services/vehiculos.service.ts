import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Vehiculo } from '../../../models/vehiculo.model';
import { AuthService } from '../../../core/services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class VehiculosService {
  private baseUrl = 'http://localhost:8080/api/vehiculos';

  constructor(private http: HttpClient, private authService: AuthService) {}

  getVehiculosUsuario(): Observable<Vehiculo[]> {
    const usuario = this.authService.getUsuario();
    if (!usuario) {
      throw new Error('Usuario no autenticado');
    }
    return this.http.get<Vehiculo[]>(`${this.baseUrl}/usuario/${usuario.id}`);
  }

  addVehiculo(placa: string): Observable<Vehiculo> {
    const usuario = this.authService.getUsuario();
    if (!usuario) {
      throw new Error('Usuario no autenticado');
    }
    const vehiculo: Vehiculo = { id: 0, placa, usuario };
    return this.http.post<Vehiculo>(this.baseUrl, vehiculo);
  }

  deleteVehiculo(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}
