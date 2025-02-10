import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Vehiculo } from '../../../../models/vehiculo.model';
import { VehiculosService } from '../../services/vehiculos.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-vehiculo-list',
  templateUrl: './vehiculo-list.component.html',
  standalone: true, // ✅ Convertido en standalone
  imports: [CommonModule] // ✅ Importa CommonModule para *ngFor, *ngIf, etc.
})


export class VehiculoListComponent implements OnInit {
  @Input() vehiculos: Vehiculo[] = [];

  constructor(
    private vehiculoService: VehiculosService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.getVehiculos();
  }

  getVehiculos(): void {
    this.vehiculoService.getVehiculosUsuario().subscribe(
      (data) => {
        this.vehiculos = data;
      },
      (error) => {
      }
    );
  }

  deleteVehiculo(id: number): void {
    if (confirm('¿Estás seguro de eliminar este vehículo?')) {
      this.vehiculoService.deleteVehiculo(id).subscribe(() => {
        this.getVehiculos();
      });
    }
  }

  goToAgregarVehiculo(): void {
    this.router.navigate(['/usuarios/vehiculos-usuario/agregar']);
  }
}
