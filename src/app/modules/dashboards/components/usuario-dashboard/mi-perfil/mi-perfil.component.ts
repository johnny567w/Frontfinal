import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Persona } from '../../../../../models/persona.model';
import { MiPerfilService } from '../../../../perfil/mi-perfil.service';
import { AuthService } from '../../../../../core/services/auth.service';

@Component({
  selector: 'app-mi-perfil',
  templateUrl: './mi-perfil.component.html',
  standalone: true,
  imports: [FormsModule, CommonModule],
})
export class MiPerfilComponent implements OnInit {
  user: Persona = {
    id: 0, // 🔥 Asegurar que esto es `number`, no `Number`
    nombre: '',
    apellido: '',
    cedula: '',
    correo: '',
    password: '',
    fechaNacimiento: new Date(),
    telefono: '',
    direccion: '',
    estado: '',
    genero: '',
    rol: { id: 0, nombre: '' }
  };
  
  userId: number = 0; // 🔥 Cambiar de `Number` a `number`
  localPhoto: string = '';
  editMode: boolean = false;

  constructor(
    private miPerfilService: MiPerfilService,
    private authService: AuthService 
  ) {}

  ngOnInit(): void {
    this.obtenerUsuarioAutenticado();
  }

  obtenerUsuarioAutenticado(): void {
    const usuario = this.authService.getUsuario();
    if (usuario && typeof usuario.id === 'number') { // 🔥 Verificar tipo correcto
      this.userId = usuario.id;
      this.cargarPerfil();
      this.cargarFotoLocal();
    } else {
      console.error('No hay un usuario autenticado.');
    }
  }

  cargarPerfil(): void {
    this.miPerfilService.getPerfilUsuario(this.userId).subscribe(user => {
      this.user = user;
    });
  }

  cargarFotoLocal(): void {
    const storedPhoto = localStorage.getItem(`profile-photo-${this.userId}`);
    this.localPhoto = storedPhoto || 'assets/img/default-avatar.png';
  }

  toggleEditMode(): void {
    this.editMode = !this.editMode;
  }

  guardarPerfil(): void {
    if (!this.user.id) {
      console.error("No se puede actualizar: ID de usuario no válido.");
      return;
    }
  
    this.miPerfilService.getPerfilUsuario(Number(this.user.id)).subscribe(usuarioExistente => {
      const perfilActualizado: Persona = {
        ...usuarioExistente, // 🔥 Mantener datos existentes (incluido rol)
        nombre: this.user.nombre,
        apellido: this.user.apellido,
        cedula: this.user.cedula,
        correo: this.user.correo,
        direccion: this.user.direccion,
        estado: this.user.estado,
        genero: this.user.genero,
        telefono: this.user.telefono,
        fechaNacimiento: this.user.fechaNacimiento
      };
  
      this.miPerfilService.actualizarPerfil(perfilActualizado).subscribe(() => {
        this.editMode = false;
        this.cargarPerfil();
      });
    });
  }
  

  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        this.localPhoto = reader.result as string;
        localStorage.setItem(`profile-photo-${this.userId}`, this.localPhoto);
      };
      reader.readAsDataURL(file);
    }
  }

  clearProfile(): void {
    this.localPhoto = '';
    localStorage.removeItem(`profile-photo-${this.userId}`);
  }
}
