import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TarifaService } from '../../../../tarifas/services/tarifas.service';
import { Tarifa } from '../../../../../models/tarifa.model';
import { HttpErrorResponse } from '@angular/common/http';

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


  async actualizarTarifa() {
    if (this.nuevaTarifa === null || this.nuevaTarifa <= 0) {
      this.mostrarMensajeConfirmacion('Por favor ingrese una tarifa válida.');
      return;
    }
  
    try {
      const tarifas = await this.tarifaService.obtenerTarifas().toPromise();
      if (!tarifas || tarifas.length === 0) {
        this.mostrarMensajeConfirmacion('No se encontró la tarifa actual.');
        return;
      }
  
      const tarifaActualizada = tarifas[0]; // 🔹 Tomar la más reciente
      tarifaActualizada.valor = this.nuevaTarifa; // 🔹 Modificar solo el valor
  
      const respuesta = await this.tarifaService.actualizarTarifa(tarifaActualizada).toPromise();
  
      if (respuesta) {
        this.tarifaActual = Number(respuesta.valor);
        this.mostrarMensajeConfirmacion(`Tarifa actualizada a $${this.nuevaTarifa}.`);
        this.nuevaTarifa = null;
      }
    } catch (error: any) {
      console.error('Error al actualizar la tarifa:', error);
    
      if (error.status === 409) {
        this.mostrarMensajeConfirmacion('La tarifa ha sido modificada por otro usuario. Recarga y vuelve a intentarlo.');
      } else {
        this.mostrarMensajeConfirmacion('Hubo un error al actualizar la tarifa.');
      }
    }
  }

  async obtenerTarifaCierreInesperado() {
    try {

      const tarifa = await this.tarifaService.obtenerTarifaPorId(2).toPromise();
      if (tarifa) {
        this.tarifaCierreInesperado = Number(tarifa.valor);
      }
    } catch (error) {
      console.error('Error al obtener la tarifa de cierre inesperado:', error);
    }
  }

  activarCierreInesperado() {
    this.tarifaCierreInesperado = this.tarifaActual * 1.0; 
    this.mostrarMensajeConfirmacion(`Se activó la tarifa de cierre inesperado: $${this.tarifaCierreInesperado}.`);

    setTimeout(() => {
      this.tarifaCierreInesperado = 0;
      this.mostrarMensajeConfirmacion('El cierre inesperado ha finalizado.');
    }, 2 * 60 * 60 * 1000); 
  }


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
  mostrarMensajeConfirmacion(mensaje: string) {
    this.mensajeConfirmacion = mensaje;
    setTimeout(() => {
      this.mensajeConfirmacion = null;
    }, 5000);
  }
}