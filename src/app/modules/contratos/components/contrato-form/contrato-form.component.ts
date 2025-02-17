import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Contrato } from '../../../../models/contrato.model';
import { ContratosService } from '../../services/contratos.service';

@Component({
  selector: 'app-contrato-form',
  standalone: true,
  imports: [],
  templateUrl: './contrato-form.component.html',
})
export class ContratoFormComponent {
  @Input() contrato: Contrato | null = null;
  @Output() contratoGuardado = new EventEmitter<void>();

  constructor(private contratosService: ContratosService) {}

  async saveContrato(): Promise<void> {
    if (this.contrato && this.contrato.id) {
      try {
        await this.contratosService.cupdateContrato(this.contrato).toPromise();
        alert('Contrato actualizado exitosamente.');
        this.contratoGuardado.emit(); 
      } catch (error) {
        console.error('Error al actualizar el contrato:', error);
        alert('Hubo un error al actualizar el contrato.');
      }
    } else {
      alert('No se pudo identificar el contrato para actualizar.');
    }
  }

  cancelEdit(): void {
    this.contrato = null;
  }
}