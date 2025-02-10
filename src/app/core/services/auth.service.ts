import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private usuarioKey = 'usuario';

  constructor() {}

  saveUsuario(usuario: any): void {
    localStorage.setItem(this.usuarioKey, JSON.stringify(usuario));
  }

  getUsuario(): any {
    const usuario = localStorage.getItem(this.usuarioKey);
    return usuario ? JSON.parse(usuario) : null;
  }

  isLoggedIn(): boolean {
    return !!this.getUsuario();
  }

  logout(): void {
    localStorage.removeItem(this.usuarioKey);
  }

  
}
