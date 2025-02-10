import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Cajero } from '../../../models/cajero.model';

@Injectable({
  providedIn: 'root'
})
export class CajerosService {
  private baseUrl = 'http://localhost:8080/api/cajeros';
  
  constructor(private http : HttpClient) { }

  getCajeros() : Observable<Cajero[]> {
    return this.http.get<Cajero[]>(this.baseUrl);
  }

  getCajeroById(id : Number) : Observable <Cajero>{
    return this.http.get<Cajero>(`${this.baseUrl}/${id}`);
  }

  createCajero(cajero : Cajero) : Observable <Cajero> {
    return this.http.post<Cajero>(this.baseUrl, cajero);
  }

  updateCajero(cajero : Cajero) : Observable <Cajero> {
    return this.http.put<Cajero>(this.baseUrl, cajero);
  }

  deleteCajero(id : Number) : Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}