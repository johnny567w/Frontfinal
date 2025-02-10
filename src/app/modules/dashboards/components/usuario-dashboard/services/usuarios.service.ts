import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Usuario } from '../../../../../models/usuario.model';

@Injectable({
  providedIn: 'root'
})
export class UsuariosService {
  private baseUrl = 'http://localhost:8080/api/usuarios';

  constructor(private http : HttpClient) { }

  getUsuarios() : Observable<Usuario[]>{
    return this.http.get<Usuario[]>(this.baseUrl);
  }

  getUsuarioById(id : Number) : Observable<Usuario> {
    return this.http.get<Usuario>(`${this.baseUrl}/${id}`);
  }

  createUsuario( persona : Usuario ){
    return this.http.post<Usuario>(this.baseUrl, persona);
  }

  updateUsuario( persona : Usuario ){
    return this.http.put<Usuario>(this.baseUrl, persona);
  }

  deleteUsuarioById( id : Number) : Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}
