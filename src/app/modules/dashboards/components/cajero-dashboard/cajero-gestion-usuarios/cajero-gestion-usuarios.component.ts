import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Observable } from 'rxjs';
import { CommonModule } from '@angular/common';
import { PersonasService } from '../../../../personas/services/personas.service';
import { Persona } from '../../../../../models/persona.model';

@Component({
  selector: 'app-cajero-gestion-usuarios',
  templateUrl: './cajero-gestion-usuarios.component.html',
  standalone: true,
  imports: [FormsModule, CommonModule],
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

  constructor(
    private personasService: PersonasService
  ) {}

  async ngOnInit(): Promise<void> {
    this.users$ = this.personasService.getPersonas();
  }

  async selectUser(user: Persona): Promise<void> {
    this.selectedUser = { ...user }; // Copia el usuario seleccionado
    this.selectedUserId = Number(user.id) ?? null;
    const storedPhoto = localStorage.getItem(`profile-photo-${this.selectedUserId}`);
    this.localPhoto = storedPhoto ?? '';
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

  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        this.localPhoto = reader.result as string; // Convertir a Base64
      };
      reader.readAsDataURL(file); // Procesar como Base64
    }
  }

  cancelEdit(): void {
    this.selectedUserId = null;
    this.localPhoto = '';
  }
}


