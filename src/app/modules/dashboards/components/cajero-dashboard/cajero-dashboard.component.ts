import { Component, OnInit } from '@angular/core';
import { RouterModule, Router } from '@angular/router';
import { AuthService } from '../../../../core/services/auth.service';

@Component({
  selector: 'app-cajero-dashboard',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './cajero-dashboard.component.html',
  styles: ``,
})
export class CajeroDashboardComponent implements OnInit {
  menuOpen = false; 
  usuario: any = null;
  nombreUsuarioActual: string = '';

  constructor(private authService: AuthService, private router: Router) {
    this.usuario = this.authService.getUsuario();
    this.nombreUsuarioActual = this.usuario ? this.usuario.nombre : 'Usuario';
  }

  ngOnInit(): void {
    console.log("CajeroDashboardComponent inicializado");
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  toggleMenu() {
    this.menuOpen = !this.menuOpen;
  }
}
