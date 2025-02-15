import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Vehiculo } from '../../../../../models/vehiculo.model';
import { Persona } from '../../../../../models/persona.model';
import { VehiculosService } from '../../../../vehiculos/services/vehiculos.service';
import { AuthService } from '../../../../../core/services/auth.service';

@Component({
  selector: 'app-vehiculos-usuario',
  standalone: true,
  imports: [CommonModule, FormsModule], // Importamos los módulos necesarios
  templateUrl: './vehiculos-usuario.component.html',
})
export class VehiculosUsuarioComponent implements OnInit {
  vehiculos: Vehiculo[] = [];
  usuarioAutenticado!: Persona;
  nuevaPlaca: string = '';

  constructor(private vehiculoService: VehiculosService, private authService: AuthService) {}

  ngOnInit(): void {
    const usuario = this.authService.getUsuario();
    if (usuario) {
      this.usuarioAutenticado = usuario;
      this.cargarVehiculos();
    }
  }

  // Cargar todos los vehículos
  cargarVehiculos(): void {
    this.vehiculoService.getVehiculos().subscribe(
      (data) => {
        this.vehiculos = data;
      },
      (error) => {
        console.error('Error al cargar vehículos:', error);
      }
    );
  }

  // Agregar un nuevo vehículo
  agregarVehiculo(): void {
    if (!this.nuevaPlaca.trim()) return;

    const nuevoVehiculo: Vehiculo = {
      id: null,  
      placa: this.nuevaPlaca,
      usuario: this.usuarioAutenticado
    };

    this.vehiculoService.addVehiculo(nuevoVehiculo).subscribe(
      (vehiculoCreado) => {
        this.vehiculos.push(vehiculoCreado); // Agregar el vehículo a la lista
        this.nuevaPlaca = ''; // Limpiar el input
      },
      (error) => {
        console.error('Error al agregar vehículo:', error);
      }
    );
  }

  // Eliminar vehículo
  eliminarVehiculo(id: number): void {
    this.vehiculoService.deleteVehiculo(id).subscribe(() => {
      this.vehiculos = this.vehiculos.filter((vehiculo) => vehiculo.id !== id);
    });
  }
}
