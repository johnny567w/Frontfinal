import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../../core/services/auth.service';
import { Usuario } from '../../../../models/usuario.model';
import { PersonasService } from '../../../personas/services/personas.service';
import { UsuariosService } from '../../../dashboards/components/usuario-dashboard/services/usuarios.service';
import { NavbarComponent } from '../../../../shared/components/navbar/navbar.component';
import { FooterComponent } from '../../../../shared/components/footer/footer.component';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [FooterComponent,ReactiveFormsModule, CommonModule,NavbarComponent],
  templateUrl: './signup.component.html',
  styles: ``,
})
export class SignupComponent {
  private _formBuilder = inject(FormBuilder);
  private _userService = inject(UsuariosService);
  private _personaService = inject(PersonasService);
  private _router = inject(Router);

  mensajeError: string | null = null;

  form = this._formBuilder.group({
    nombre: ['', [Validators.required]],
    apellido: ['', [Validators.required]],
    cedula: ['', [Validators.required, Validators.minLength(10)]],
    fechaNacimiento: ['', [Validators.required]],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
    telefono: ['', [Validators.required]],
    direccion: ['', [Validators.required]],
    genero: ['', [Validators.required]],
  });

  // Validaciones de campos
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
  

  async submit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched(); 
      return;
    }
  
    const formValues = this.form.value;
    
    const generoChar = formValues.genero === 'masculino' ? 'M' : 'F';
    const persona = {
      id: 0,
      nombre: formValues.nombre!,
      apellido: formValues.apellido!,
      cedula: formValues.cedula!,
      correo: formValues.email!,
      password: formValues.password!,
      fechaNacimiento: new Date(formValues.fechaNacimiento!),
      telefono: formValues.telefono!,
      direccion: formValues.direccion!,
      estado: 'Activo', 
      genero: generoChar,
      rol: { id: 2, nombre: 'Usuario' }, 
    };
  
    try {
      console.log("Registrando " + persona);
      console.log(persona);
      const personaRegistrada = await this._personaService.createPersona(persona).toPromise();
      console.log("Registrada persona");
      
      if (!personaRegistrada) {
        throw new Error('Error al registrar la persona. No se recibió una respuesta válida.');
      }
  
      const usuario = {
        id: 0,
        fechaRegistro: new Date(), 
        persona: personaRegistrada,
      };
  
      const usuarioRegistrado = await this._userService.createUsuario(usuario).toPromise();
      console.log("Registrado usuario");
  
      localStorage.setItem('usuario', JSON.stringify(usuarioRegistrado));
  
      this._router.navigate(['/usuarios']);
    } catch (error) {
      console.error('Error en el registro:', error);
      this.mostrarMensajeError('Hubo un problema al crear tu cuenta. Intenta nuevamente.');
    }
  }
  

  async signInGoogle() {
    console.log('Registrarse con Google (por implementar)');
  }

  mostrarMensajeError(mensaje: string) {
    this.mensajeError = mensaje;
    setTimeout(() => {
      this.mensajeError = null;
    }, 5000);
  }
}
