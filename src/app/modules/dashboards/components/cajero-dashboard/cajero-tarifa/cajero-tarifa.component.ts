import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TarifaService } from '../../../../tarifas/services/tarifas.service';
import { Tarifa } from '../../../../../models/tarifa.model';

@Component({
  selector: 'app-cajero-tarifa',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './cajero-tarifa.component.html',
  styles: [],
})
export class CajeroTarifaComponent implements OnInit {
  tarifaActual: number = 0;
  nuevaTarifa: number | null = null;
  tarifaCierreInesperado: number = 0;
  tarifaEspecial: number = 0;
  nuevaTarifaEspecial: number | null = null;
  fechaEspecial: string = '';

  mensajeConfirmacion: string | null = null;

  constructor(private tarifaService: TarifaService) {}

  async ngOnInit() {
    await this.obtenerTarifaActual();
    await this.obtenerTarifaCierreInesperado();
  }

  /** Obtener la tarifa normal */
  async obtenerTarifaActual() {
    try {
      const tarifas = await this.tarifaService.obtenerTarifas().toPromise();
      if (tarifas && tarifas.length > 0) {
        this.tarifaActual = Number(tarifas[0].valor);
      } else {
        console.warn('No se encontraron tarifas.');
      }
    } catch (error) {
      console.error('Error al obtener la tarifa actual:', error);
    }
  }

  /** Actualizar la tarifa normal */
  async actualizarTarifa() {
    if (this.nuevaTarifa === null || this.nuevaTarifa <= 0) {
      this.mostrarMensajeConfirmacion('Por favor ingrese una tarifa válida.');
      return;
    }

    try {
      const tarifaActualizada = await this.tarifaService
        .actualizarTarifa({ id: 1, valor: this.nuevaTarifa })
        .toPromise();

      if (tarifaActualizada) {
        this.tarifaActual = Number(tarifaActualizada.valor);
        this.mostrarMensajeConfirmacion(`Tarifa actualizada a $${this.nuevaTarifa}.`);
        this.nuevaTarifa = null;
      }
    } catch (error) {
      console.error('Error al actualizar la tarifa:', error);
      this.mostrarMensajeConfirmacion('Hubo un error al actualizar la tarifa.');
    }
  }

  /** Obtener la tarifa de cierre inesperado */
  async obtenerTarifaCierreInesperado() {
    try {
      // Supongamos que existe una tarifa específica en la API para esto
      const tarifa = await this.tarifaService.obtenerTarifaPorId(2).toPromise();
      if (tarifa) {
        this.tarifaCierreInesperado = Number(tarifa.valor);
      }
    } catch (error) {
      console.error('Error al obtener la tarifa de cierre inesperado:', error);
    }
  }

  /** Activar tarifa de cierre inesperado por 2 horas */
  activarCierreInesperado() {
    this.tarifaCierreInesperado = this.tarifaActual * 1.5; // Ejemplo: se incrementa 50%
    this.mostrarMensajeConfirmacion(`Se activó la tarifa de cierre inesperado: $${this.tarifaCierreInesperado}.`);

    setTimeout(() => {
      this.tarifaCierreInesperado = 0;
      this.mostrarMensajeConfirmacion('El cierre inesperado ha finalizado.');
    }, 2 * 60 * 60 * 1000); // 2 horas en milisegundos
  }

  /** Guardar tarifa especial para una fecha seleccionada */
  async guardarTarifaEspecial() {
    if (!this.fechaEspecial || this.nuevaTarifaEspecial === null || this.nuevaTarifaEspecial <= 0) {
      this.mostrarMensajeConfirmacion('Ingrese una fecha y tarifa válida.');
      return;
    }

    try {
      const tarifaEspecial = await this.tarifaService
        .crearTarifa({ id: 3, valor: this.nuevaTarifaEspecial })
        .toPromise();

      if (tarifaEspecial) {
        this.tarifaEspecial = Number(tarifaEspecial.valor);
        this.mostrarMensajeConfirmacion(`Tarifa especial de $${this.nuevaTarifaEspecial} guardada para ${this.fechaEspecial}.`);
        this.nuevaTarifaEspecial = null;
      }
    } catch (error) {
      console.error('Error al guardar la tarifa especial:', error);
      this.mostrarMensajeConfirmacion('Hubo un error al guardar la tarifa especial.');
    }
  }

  /** Mostrar mensajes de confirmación */
  mostrarMensajeConfirmacion(mensaje: string) {
    this.mensajeConfirmacion = mensaje;
    setTimeout(() => {
      this.mensajeConfirmacion = null;
    }, 5000);
  }
}