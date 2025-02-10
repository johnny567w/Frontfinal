import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '../core/services/auth.service';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  const usuario = authService.getUsuario(); // Obtener usuario autenticado

  if (!usuario) {
    router.navigate(['/login']);
    return false;
  }

  // Verifica el rol antes de permitir la navegación
  const userRole = usuario.rol.id; // 1 = Cajero, 2 = Usuario
  const rutaIntentada = state.url;

  if (userRole === 1 && rutaIntentada.startsWith('/usuarios')) {
    router.navigate(['/cajeros']); // Redirigir a cajeros si es un cajero
    return false;
  }

  if (userRole === 2 && rutaIntentada.startsWith('/cajeros')) {
    router.navigate(['/usuarios']); // Redirigir a usuarios si es un usuario normal
    return false;
  }

  return true;
};
