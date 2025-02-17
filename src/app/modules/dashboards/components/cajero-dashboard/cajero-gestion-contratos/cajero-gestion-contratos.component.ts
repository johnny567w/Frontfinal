import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ContratosService } from '../../../../contratos/services/contratos.service';
import { Contrato } from '../../../../../models/contrato.model';
import { Persona } from '../../../../../models/persona.model';
import { UsuariosService } from '../../usuario-dashboard/services/usuarios.service';
import { Usuario } from '../../../../../models/usuario.model';
import { EspacioService } from '../../../../espacios/services/espacio.service';

@Component({
  selector: 'app-cajero-gestion-contratos',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './cajero-gestion-contratos.component.html',
})
export class CajeroGestionContratosComponent implements OnInit {
  personas: Persona[] = [];
  contratos: Contrato[] = [];
  contratosFiltrados: Contrato[] = [];
  personaSeleccionada: string = '';
  selectedContrato: Contrato | null = null;
  tarifaBase: number = 0;

  constructor(
    private contratosService: ContratosService,
    private usuariosService: UsuariosService,
    private espaciosServices: EspacioService
    
  ) {}

  ngOnInit(): void {
    this.cargarPersonas();
    this.obtenerContratos();
  }

  cargarPersonas(): void {
    this.usuariosService.getUsuarios().subscribe(
      (usuarios: Usuario[]) => {
        this.personas = usuarios.map(user => user.persona); 
      },
      (error) => {
        console.error('Error al obtener personas:', error);
      }
    );
  }

  obtenerContratos(): void {
    this.contratosService.getContratos().subscribe(
      (contratos: Contrato[]) => {
        this.contratos = contratos;
        this.contratosFiltrados = contratos;
      },
      (error) => {
        console.error('Error al obtener contratos:', error);
      }
    );
  }

  filtrarContratos(): void {
    if (this.personaSeleccionada) {
      this.contratosFiltrados = this.contratos.filter(
        (contrato) => contrato.usuario?.persona.id.toString() === this.personaSeleccionada
      );
    } else {
      this.contratosFiltrados = this.contratos;
    }
  }

  selectContrato(contrato: Contrato): void {
    this.selectedContrato = { ...contrato };
  }

  calcularDuracionMeses(fechaInicio: Date | string, fechFin: Date | string): number {
    const inicio = new Date(fechaInicio);
    const fin = new Date(fechFin);
    return (fin.getFullYear() - inicio.getFullYear()) * 12 + (fin.getMonth() - inicio.getMonth());
  }

  recalcularCosto(): void {
    if (this.selectedContrato) {
      const meses = this.calcularDuracionMeses(this.selectedContrato.fechaInicio, this.selectedContrato.fechaFin);
      this.selectedContrato.montoTotal = meses * this.tarifaBase;
    }
  }

  async saveContrato(): Promise<void> {
    if (this.selectedContrato && this.selectedContrato.id) {
      try {
        await this.contratosService.cupdateContrato(this.selectedContrato).toPromise();
        alert('Contrato actualizado exitosamente.');
        this.obtenerContratos();
        this.cancelEdit();
      } catch (error) {
        console.error('Error al actualizar contrato:', error);
        alert('Hubo un error al actualizar el contrato.');
      }
    } else {
      alert('No se pudo identificar el contrato para actualizar.');
    }
  }

  async eliminarContrato(contrato: Contrato): Promise<void> {
    const confirmacion = confirm('¿Estás seguro de que deseas eliminar este contrato?');
    if (!confirmacion) return;
    try {
        await this.contratosService.deleteContrato(contrato.id).toPromise();
        const espacioActualizado = { 
            ...contrato.espacio, 
            ocupado: false, 
            reservado: false, 
            estado: "DISPONIBLE" 
        };
        await this.espaciosServices.updateEspacio(espacioActualizado).toPromise();
        alert('Contrato eliminado y espacio actualizado exitosamente.');       
        this.obtenerContratos();
    } catch (error) {
        alert('Hubo un error al eliminar el contrato.');
    }
}
  cancelEdit(): void {
    this.selectedContrato = null;
  }
}