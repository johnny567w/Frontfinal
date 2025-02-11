import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { Router } from '@angular/router';
import { UsuariosService } from '../../../dashboards/components/usuario-dashboard/services/usuarios.service';
import { PersonasService } from '../../../personas/services/personas.service';
import { NavbarComponent } from '../../../../shared/components/navbar/navbar.component';
import { FooterComponent } from '../../../../shared/components/footer/footer.component';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [FooterComponent, ReactiveFormsModule, CommonModule, NavbarComponent],
  templateUrl: './signup.component.html',
  styles: ``,
})
export class SignupComponent {
  private _formBuilder = inject(FormBuilder);
  private _userService = inject(UsuariosService);
  private _personaService = inject(PersonasService);
  private _router = inject(Router);

  mensaje: string | null = null;
  exito: boolean = false;

  form = this._formBuilder.group({
    nombre: ['', [Validators.required]],
    apellido: ['', [Validators.required]],
    cedula: ['', [Validators.required, Validators.pattern(/^\d{10}$/)]], // Exactamente 10 dígitos
    fechaNacimiento: ['', [Validators.required, SignupComponent.validarFechaNacimiento]], // Cambio aquí: Llamado estático
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
    telefono: ['', [Validators.required]],
    direccion: ['', [Validators.required, Validators.pattern(/^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/)]], // Solo letras y espacios
    genero: ['', [Validators.required]],
  });

  static validarFechaNacimiento(control: AbstractControl): ValidationErrors | null {
    if (!control.value) return null;

    const fechaNacimiento = new Date(control.value);
    const hoy = new Date();
    const anioMinimo = 1920;

    if (fechaNacimiento > hoy) {
      return { fechaInvalida: true };
    }

    if (fechaNacimiento.getFullYear() < anioMinimo) {
      return { fechaInvalida: true };
    }

    return null;
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
      const personaRegistrada = await this._personaService.createPersona(persona).toPromise();

      if (!personaRegistrada) {
        throw new Error('Error al registrar la persona. No se recibió una respuesta válida.');
      }

      const usuario = {
        id: 0,
        fechaRegistro: new Date(),
        persona: personaRegistrada,
      };

      const usuarioRegistrado = await this._userService.createUsuario(usuario).toPromise();
      localStorage.setItem('usuario', JSON.stringify(usuarioRegistrado));

      this.mensaje = "Cuenta creada con éxito. ¡Bienvenido!";
      this.exito = true;
      this.form.reset();
      this._router.navigate(['/usuarios']);
    } catch (error) {
      console.error('Error en el registro:', error);
      this.mensaje = "Hubo un problema al crear tu cuenta. Intenta nuevamente.";
      this.exito = false;
    }
  }

  async signInGoogle() {
    console.log('Registrarse con Google (por implementar)');
  }
  
  esRequerido(field: string): boolean {
    const control = this.form.get(field);
    return !!control && control.hasError('required') && control.touched;
  }
  
  esCedulaValida(): boolean {
    const control = this.form.get('cedula');
    return !!control && control.hasError('pattern') && control.touched;
  }
  
  esFechaNacimientoValida(): boolean {
    const control = this.form.get('fechaNacimiento');
    return !!control && control.hasError('fechaInvalida') && control.touched;
  }
  
  esDireccionValida(): boolean {
    const control = this.form.get('direccion');
    return !!control && control.hasError('pattern') && control.touched;
  }
  
  esEmailValido(): boolean {
    const control = this.form.get('email');
    return !!control && control.hasError('email') && control.touched;
  }
  
  esPasswordValida(): boolean {
    const control = this.form.get('password');
    return !!control && control.hasError('minlength') && control.touched;
  }
  
}
