import { Routes } from '@angular/router';
import { authGuard } from './core/auth.guard';
import { CajeroDashboardComponent } from './modules/dashboards/components/cajero-dashboard/cajero-dashboard.component';
import { UsuarioDashboardComponent } from './modules/dashboards/components/usuario-dashboard/usuario-dashboard.component';
import { UsuarioInicioComponent } from './modules/dashboards/components/usuario-dashboard/usuario-inicio/usuario-inicio.component';
import { VehiculosUsuarioComponent } from './modules/dashboards/components/usuario-dashboard/vehiculos-usuario/vehiculos-usuario.component';
import { VehiculoListComponent } from './modules/vehiculos/components/vehiculo-list/vehiculo-list.component';
import { VehiculoFormComponent } from './modules/vehiculos/components/vehiculo-form/vehiculo-form.component';
import { MiPerfilComponent } from './modules/dashboards/components/usuario-dashboard/mi-perfil/mi-perfil.component';

export const routes: Routes = [
  {
    path: 'inicio',
    loadComponent: () =>
      import('./shared/components/inicio/inicio.component').then((m) => m.InicioComponent),
  },
  {
    path: 'login',
    loadComponent: () =>
      import('./modules/auth/components/login/login.component').then((m) => m.LoginComponent),
  },
  {
    path: 'signup',
    loadComponent: () =>
      import('./modules/auth/components/signup/signup.component').then((m) => m.SignupComponent),
  },
  {
    path: 'usuarios',
    component: UsuarioDashboardComponent,
    canActivate: [authGuard],
    children: [
      { path: '', redirectTo: 'inicio-usuario', pathMatch: 'full' },
      { path: 'inicio-usuario', component: UsuarioInicioComponent },
      { path: 'vehiculos-usuario', component: VehiculosUsuarioComponent},
  
      { path: 'mi-perfil', component: MiPerfilComponent },
    //  { path: 'contratos-usuario', component: UsuarioAdquirirContratosComponent},
    ],
  },
  {
    path: 'cajeros',
    component: CajeroDashboardComponent,
    canActivate: [authGuard],
    children: [
      { path: '', redirectTo: 'inicio-cajero', pathMatch: 'full' },
      /* { path: 'inicio-cajero', component: CajeroInicioComponent },
      { path: 'gestion-espacios', component: CajeroGestionEspaciosComponent },
      { path: 'gestion-usuarios', component: CajeroGestionUsuariosComponent },
      { path: 'gestion-contratos', component: CajeroGestionContratosComponent },
      { path: 'gestion-tarifa-horario', component: CajeroTarifaHorarioComponent }, */
    ],
  },
  {
    path: 'vehiculos-usuario',
    component: VehiculoListComponent,
    canActivate: [authGuard]
  },
  {
    path: 'vehiculos-usuario/agregar',
    component: VehiculoFormComponent,
    canActivate: [authGuard]
  },
  
  {
    path: '**',
    redirectTo: '/inicio',
  },
];
