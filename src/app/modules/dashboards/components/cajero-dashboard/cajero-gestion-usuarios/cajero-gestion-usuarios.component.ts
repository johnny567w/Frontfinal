import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Observable } from 'rxjs';
import { CommonModule } from '@angular/common';
import { PersonasService } from '../../../../personas/services/personas.service';
import { Persona } from '../../../../../models/persona.model';
import { FooterComponent } from '../../../../../shared/components/footer/footer.component';

@Component({
  selector: 'app-cajero-gestion-usuarios',
  templateUrl: './cajero-gestion-usuarios.component.html',
  standalone: true,
  imports: [FormsModule, CommonModule,FooterComponent],
})
export class CajeroGestionUsuariosComponent implements OnInit {
  users$: Observable<Persona[]> | undefined;
  selectedUser: Persona = {
    id: 0,
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

  selectedUserId: number | null = null;
  localPhoto: string = '';
  currentUser: Persona | null = null;

  @ViewChild('editForm') editForm!: ElementRef; // Referencia al formulario

  constructor(private personasService: PersonasService) {}

  async ngOnInit(): Promise<void> {
    this.users$ = this.personasService.getPersonas();
  }

  async selectUser(user: Persona): Promise<void> {
    this.selectedUser = { ...user }; // Copia el usuario seleccionado
    this.selectedUserId = Number(user.id) ?? null;
    const storedPhoto = localStorage.getItem(`profile-photo-${this.selectedUserId}`);
    this.localPhoto = storedPhoto ?? '';

    // 🔽 Hacer scroll al formulario después de seleccionar usuario
    setTimeout(() => {
      document.getElementById('edit-form')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
  }

  async updateUser(): Promise<void> {
    if (this.selectedUserId !== null) {
      try {
        await this.personasService.updatePersona(this.selectedUser).toPromise();
        alert('Perfil actualizado exitosamente');

        this.refreshUsers(); // 🔄 Recargar la lista de usuarios después de actualizar
        this.cancelEdit();
      } catch (error) {
        alert('Error al actualizar el perfil.');
      }
    }
  }

  async deleteUser(id: number): Promise<void> {
    if (confirm(`¿Seguro que deseas eliminar a este usuario?`)) {
      try {
        await this.personasService.deletePersonaById(id).toPromise();
        alert('Usuario eliminado exitosamente.');

        this.refreshUsers(); // 🔄 Recargar la lista de usuarios después de eliminar
      } catch (error) {
        alert('Error al eliminar el usuario.');
      }
    }
  }

  refreshUsers(): void {
    this.users$ = this.personasService.getPersonas();
  }

  async saveUser(): Promise<void> {
    if (this.selectedUserId !== null) {
      try {
        await this.personasService.updatePersona(this.selectedUser).toPromise();
        localStorage.setItem(`profile-photo-${this.selectedUserId}`, this.localPhoto);
        alert('Perfil actualizado exitosamente');
        this.cancelEdit();
      } catch (error) {
        alert('Error al actualizar el perfil.');
      }
    }
  }

  cancelEdit(): void {
    this.selectedUserId = null;
    this.selectedUser = {
      id: 0,
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
  }

  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        this.localPhoto = reader.result as string; // Convertir a Base64
      };
      reader.readAsDataURL(file);
    }
  }
}


