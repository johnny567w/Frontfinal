import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { VehiculosService } from '../../../../vehiculos/services/vehiculos.service';
import { Vehiculo } from '../../../../../models/vehiculo.model';
import { VehiculoListComponent } from '../../../../vehiculos/components/vehiculo-list/vehiculo-list.component';
import { VehiculoFormComponent } from '../../../../vehiculos/components/vehiculo-form/vehiculo-form.component';

@Component({
  selector: 'app-vehiculos-usuario',
  templateUrl: './vehiculos-usuario.component.html',
  standalone: true,
  imports: [
    CommonModule,
    VehiculoListComponent, 
    VehiculoFormComponent  
  ]
})
export class VehiculosUsuarioComponent implements OnInit {
  vehiculos: Vehiculo[] = [];
  mostrarFormulario = false;

  constructor(private vehiculosService: VehiculosService) {}

  ngOnInit(): void {
    this.cargarVehiculos();
  }

  cargarVehiculos(): void {
    this.vehiculosService.getVehiculosUsuario().subscribe(
      (data) => {
        this.vehiculos = data;
      },
      (error) => {
        console.error('Error al cargar los vehículos');
      }
    );
  }

  toggleFormulario(): void {
    this.mostrarFormulario = !this.mostrarFormulario;
  }

  onVehiculoAgregado(): void {
    this.toggleFormulario();
    this.cargarVehiculos();
  }
}
