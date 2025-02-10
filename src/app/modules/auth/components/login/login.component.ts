import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../../../core/services/auth.service';
import { UsuariosService } from '../../../dashboards/components/usuario-dashboard/services/usuarios.service';
import { Router } from '@angular/router';
import { PersonasService } from '../../../personas/services/personas.service';
import { NavbarComponent } from '../../../../shared/components/navbar/navbar.component';
import { FooterComponent } from '../../../../shared/components/footer/footer.component';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FooterComponent,ReactiveFormsModule, CommonModule,NavbarComponent],
  templateUrl: './login.component.html',
  styles: ``
})
export class LoginComponent {
  private _authService = inject(AuthService);
  private _usuarioService = inject(UsuariosService);
  private _personaService = inject(PersonasService);
  private _formBuilder = inject(FormBuilder);
  private _router = inject(Router);

  mensajeError: string | null = null;

  form = this._formBuilder.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
  });

  esRequerido(field: string): boolean {
    const control = this.form.get(field);
    return control ? control.hasError('required') && control.touched : false;
  }

  esEmailValido(): boolean {
    const control = this.form.get('email');
    return control ? control.hasError('email') && control.touched : false;
  }

  esPasswordValida(): boolean {
    const control = this.form.get('password');
    return control ? control.hasError('minlength') && control.touched : false;
  }

  async iniciarSesion() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const { email, password } = this.form.value;

    try {
      const personas = await this._personaService.getPersonas().toPromise();
      if (!personas){
        return;
      }
      console.log(personas);
      const personaEncontrada = personas.find(
        (persona) => persona.correo === email && persona.password === password
      );

      if (personaEncontrada) {
        this._authService.saveUsuario(personaEncontrada);

        console.log(personaEncontrada.rol.id );
        if (personaEncontrada.rol.id == 1){
          this._router.navigate(['/cajeros']);
        } else{
          this._router.navigate(['/usuarios']);
        }
      } else {
        this.mostrarMensajeError('Correo o contraseña incorrectos');
      }
    } catch (error) {
      console.error('Error en el login:', error);
      this.mostrarMensajeError('Hubo un problema al iniciar sesión. Intenta nuevamente.');
    }
  }

  async signInGoogle() {
    console.log('Iniciar sesión con Google (por implementar)');
  }

  mostrarMensajeError(mensaje: string) {
    this.mensajeError = mensaje;
    setTimeout(() => {
      this.mensajeError = null;
    }, 5000);
  }
}
