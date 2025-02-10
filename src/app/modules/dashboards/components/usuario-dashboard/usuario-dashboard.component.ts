import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule, RouterOutlet } from '@angular/router';
import { AuthService } from '../../../../core/services/auth.service';
import { FooterComponent } from '../../../../shared/components/footer/footer.component';

@Component({
  selector: 'app-usuario-dashboard',
  standalone: true,
  templateUrl: './usuario-dashboard.component.html',
  imports: [CommonModule,RouterOutlet,FooterComponent,RouterModule]
})
export class UsuarioDashboardComponent {
  menuOpen = false; 

  usuario: any = null;
  nombreUsuarioActual: string = '';

  constructor(private authService: AuthService, private router: Router) {
    this.usuario = this.authService.getUsuario();
    this.nombreUsuarioActual = this.usuario ? this.usuario.nombre : 'Usuario';
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
  toggleMenu() {
    this.menuOpen = !this.menuOpen;
  }

}
