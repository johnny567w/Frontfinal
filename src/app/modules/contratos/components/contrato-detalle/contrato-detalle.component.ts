import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Contrato } from '../../../../models/contrato.model';
import { ContratosService } from '../../services/contratos.service';

@Component({
  selector: 'app-contrato-detalle',
  standalone: true,
  imports: [],
  templateUrl: './contrato-detalle.component.html',
  styleUrl: './contrato-detalle.component.scss'
})
export class ContratoDetalleComponent {
  @Input() contrato: Contrato | null = null;
  @Output() contratoEliminado = new EventEmitter<void>();

  constructor(private contratosService: ContratosService) {}

  async eliminarContrato(): Promise<void> {
    if (!this.contrato) return;

    const confirmacion = confirm('¿Estás seguro de que deseas eliminar este contrato?');
    if (!confirmacion) return;

    try {
      await this.contratosService.deleteEspacio(this.contrato.id).toPromise();
      alert('Contrato eliminado exitosamente.');
      this.contratoEliminado.emit(); // Notificar eliminación
    } catch (error) {
      console.error('Error al eliminar el contrato:', error);
      alert('Hubo un error al eliminar el contrato.');
    }
  }
}