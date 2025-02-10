import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Espacio } from '../../../models/espacio.model';

@Injectable({
  providedIn: 'root'
})
export class EspacioService {
  private baseUrl = 'http://localhost:8080/api/espacios';

  constructor(private http : HttpClient) { }

  getEspacios() : Observable<Espacio[]>{
    return this.http.get<Espacio[]>(this.baseUrl);
  }

  getEspacioById(id : Number) : Observable<Espacio> {
    return this.http.get<Espacio>(`${this.baseUrl}/${id}`);
  }

  createEspacio(espacio: Espacio): Observable<Espacio> {
    return this.http.post<Espacio>(this.baseUrl, espacio);
  }

  updateEspacio(espacio: Espacio): Observable<Espacio> {
    return this.http.put<Espacio>(this.baseUrl, espacio);
  }

  deleteEspacio(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }

}