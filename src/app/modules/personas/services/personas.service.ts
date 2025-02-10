import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Persona } from '../../../models/persona.model';

@Injectable({
  providedIn: 'root'
})
export class PersonasService {
  private baseUrl = 'http://localhost:8080/api/personas';

  constructor(private http : HttpClient) { }

  getPersonas() : Observable<Persona[]>{
    return this.http.get<Persona[]>(this.baseUrl);
  } 

  getPersonaById(id : Number) : Observable<Persona> {
    return this.http.get<Persona>(`${this.baseUrl}/${id}`);
  }

  createPersona( persona : Persona ){
    return this.http.post<Persona>(this.baseUrl, persona);
  }

  updatePersona( persona : Persona ){
    return this.http.put<Persona>(this.baseUrl, persona);
  }

  deletePersonaById( id : Number) : Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}
