import { Component, EventEmitter, Output, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { VehiculosService } from '../../services/vehiculos.service';

@Component({
  selector: 'app-vehiculo-form',
  templateUrl: './vehiculo-form.component.html',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule] // ✅ Importa todo lo necesario
})
export class VehiculoFormComponent {
  vehiculoForm: FormGroup;

  @Output() vehiculoAgregado = new EventEmitter<void>();

  private fb = inject(FormBuilder); // ✅ Inyección recomendada en standalone components
  private vehiculoService = inject(VehiculosService);

  constructor() {
    this.vehiculoForm = this.fb.group({
      placa: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(7)]]
    });
  }

  submitForm(): void {
    if (this.vehiculoForm.invalid) return;

    const placa = this.vehiculoForm.value.placa as string; // ✅ Asegura el tipo string

    this.vehiculoService.addVehiculo(placa).subscribe({
      next: () => {
        this.vehiculoAgregado.emit();
      },
      error: (err) => {
        console.error('Error al agregar el vehículo:', err); // ✅ Manejo de errores
      }
    });
  }
}
