import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms'; 
import { CommonModule } from '@angular/common'; 
import { HttpErrorResponse } from '@angular/common/http';

import { Persona } from '../../../../../models/persona.model';
import { ContratosService } from '../../../../contratos/services/contratos.service';
import { AuthService } from '../../../../../core/services/auth.service';
import { Contrato } from '../../../../../models/contrato.model';
import { Espacio } from '../../../../../models/espacio.model';
import { EspacioService } from '../../../../espacios/services/espacio.service';
import { TarifaService } from '../../../../tarifas/services/tarifas.service';
import { Usuario } from '../../../../../models/usuario.model';
import { UsuariosService } from '../services/usuarios.service';

@Component({
  selector: 'app-usuario-adquirir-contratos',
  templateUrl: './usuario-adquirir-contratos.component.html',
  standalone: true,
  imports: [FormsModule, CommonModule], 
})
export class UsuarioAdquirirContratosComponent implements OnInit {
  contrato: Contrato = {
    id: 0, 
    usuario: { id: 0, persona: {} as Persona, fechaRegistro: new Date() },
    espacio: { id: 0, ocupado: false, reservado: false, estado: "DISPONIBLE" },
    fechaInicio: new Date(),
    fechaFin: new Date(),
    montoTotal: 0
};

  contratos: Contrato[] = [];
  espaciosDisponibles: Espacio[] = [];
  espaciosDisponiblesFiltrados: Espacio[] = [];
  espaciosReservadosFiltrados: Espacio[] = [];
  personaAutenticada: Persona | null = null;
  espacioSeleccionado: number | null = null;
  contratoSeleccionado: number | null = null;
  contratosOriginales: Contrato[] = []; 
  espaciosOcupados: Espacio[] = [];
  mostrarFormulario: boolean = false;
  rangosEspacios: string[] = ['1-25', '26-50', '51-75', '76-100'];
  rangoSeleccionado: string = '1-25';
  tarifaActual: number = 0;
  errorFecha: boolean = false;


  constructor(
    private contratosService: ContratosService,
    private espaciosService: EspacioService,
    private authService: AuthService,
    private usuariosService: UsuariosService
  ) {}

  async ngOnInit(): Promise<void> {
    try {
        this.personaAutenticada = this.authService.getUsuario(); 

        if (!this.personaAutenticada) {
            alert('Error: No se encontró un usuario autenticado.');
            return;
        }
        await this.cargarTarifaActual();
        this.cargarContratos();
        this.cargarEspacios();
    } catch (error) {
        console.error('Error al inicializar:', error);
        alert('Error al cargar datos.');
    }
}
  async cargarTarifaActual() {
    try {
      const tarifa = await this.contratosService.getContratoById(1).toPromise();
      if (tarifa) {
        this.tarifaActual = Number(tarifa.montoTotal);
      }
    } catch (error) {
      console.error('Error al obtener la tarifa actual:', error);
    }
  }
  cargarEspacios(): void {
    this.espaciosService.getEspacios().subscribe(
        (espacios: Espacio[]) => {
            console.log('✅ Espacios obtenidos:', espacios); // Verificar la respuesta

            if (!Array.isArray(espacios)) {
                console.error('❌ La API no devolvió una lista válida de espacios:', espacios);
                alert('Error: No se pudieron cargar los espacios.');
                return;
            }

            // ✅ Guardamos los espacios en sus respectivas categorías
            this.espaciosDisponibles = espacios.filter(e => !e.ocupado && !e.reservado);
            this.espaciosReservadosFiltrados = espacios.filter(e => e.reservado);
            this.espaciosOcupados = espacios.filter(e => e.ocupado);

            console.log('✅ Espacios disponibles:', this.espaciosDisponibles);
            console.log('✅ Espacios ocupados:', this.espaciosOcupados);
            console.log('✅ Espacios reservados:', this.espaciosReservadosFiltrados);

            this.filtrarEspaciosPorRango();
        },
        (error) => {
            console.error('❌ Error al cargar espacios:', error);
            alert('No se pudieron cargar los espacios.');
        }
    );
}

cargarContratos(): void {
  if (!this.personaAutenticada) return;

  this.usuariosService.getUsuarios().subscribe(usuarios => {
      if (!usuarios || !Array.isArray(usuarios)) {
          console.error('❌ No se pudo obtener la lista de usuarios.');
          return;
      }

      const usuarioCorrecto = usuarios.find(u => u.persona?.id === this.personaAutenticada!.id);

      if (!usuarioCorrecto || !usuarioCorrecto.id) {
          console.error('❌ No se encontró el usuario asociado a la persona ID:', this.personaAutenticada!.id);
          return;
      }

      console.log('✅ Usuario autenticado correctamente:', usuarioCorrecto);

      this.contratosService.getContratos().subscribe(contratos => {
          this.contratos = contratos.filter(c => {
              console.log(`Comparando contrato ID ${c.usuario.id} con usuario autenticado ID ${usuarioCorrecto.id}`);
              return c.usuario.id === usuarioCorrecto.id;
          });

          console.log('✅ Contratos filtrados:', this.contratos);
          this.contratosOriginales = JSON.parse(JSON.stringify(this.contratos)); 
      });
  });
}

  filtrarEspaciosPorRango(): void {
    const [inicio, fin] = this.rangoSeleccionado.split('-').map(Number);
    this.espaciosDisponiblesFiltrados = this.espaciosDisponibles.filter(
      espacio => Number(espacio.id) >= inicio && Number(espacio.id) <= fin
    );
    this.espaciosReservadosFiltrados = this.espaciosReservadosFiltrados.filter(
      espacio => Number(espacio.id) >= inicio && Number(espacio.id) <= fin
    );
  }

  seleccionarEspacio(id: number): void {
    const espacioSeleccionado = this.espaciosDisponibles.find(e => e.id === id);

    if (!espacioSeleccionado) {
      alert('El espacio seleccionado no está disponible.');
      return;
    }

    this.espacioSeleccionado = id;
    this.contrato.espacio = { id, ocupado: false, reservado: false, estado: "DISPONIBLE" };
  }

  async adquirirContrato(): Promise<void> {
    if (!this.espacioSeleccionado || !this.personaAutenticada) {
        alert('Por favor selecciona un espacio.');
        return;
    }
    try {
        const usuarios = await this.usuariosService.getUsuarios().toPromise();
        if (!usuarios || !Array.isArray(usuarios)) {
            alert('Error: No se pudo obtener la lista de usuarios.');
            return;
        }
        const usuarioCorrecto = usuarios.find(u => u.persona?.id === this.personaAutenticada?.id);
        if (!usuarioCorrecto || !usuarioCorrecto.id) {
            alert('Error: No se encontró el usuario correspondiente.');
            return;
        }
        const duracionMeses = this.getDuracionMeses({
            fechaInicio: this.contrato.fechaInicio,
            fechaFin: this.contrato.fechaFin 
        } as Contrato);

        const costoTotal = duracionMeses * this.tarifaActual; 
        const nuevoContrato: any = {
            id: null,  
            usuario: {
                id: usuarioCorrecto.id, 
                persona: this.personaAutenticada,
                fechaRegistro: new Date()
            },
            espacio: { id: this.espacioSeleccionado, ocupado: true, reservado: false, estado: "OCUPADO" },
            fechaInicio: this.contrato.fechaInicio,
            fechaFin: this.contrato.fechaFin,  
            montoTotal: costoTotal,
        };
        const respuesta = await this.contratosService.createContrato(nuevoContrato).toPromise();
        await this.espaciosService.updateEspacio(nuevoContrato.espacio).toPromise();
        this.cargarEspacios();
        alert('Contrato adquirido exitosamente.');
    } catch (error) {
        alert('Hubo un error al adquirir el contrato.');
    }
}

  mostrarInformacion(idEspacio: number | null): void {
    this.contratoSeleccionado = idEspacio;
  }

  calcularFechaFin(fechaInicio: Date): Date {
    if (!fechaInicio) {
        return new Date(); 
    }

    const fecha = new Date(fechaInicio);
    fecha.setMonth(fecha.getMonth() + 1); 
    return fecha;
}

getDuracionMeses(contrato: Contrato): number {
  const inicio = new Date(contrato.fechaInicio);
  const fin = new Date(contrato.fechaFin);
  return (fin.getFullYear() - inicio.getFullYear()) * 12 + (fin.getMonth() - inicio.getMonth());
}

  validarFecha(): void {
    if (!this.contrato.fechaInicio) {
      this.errorFecha = true;
      return;
    }
    const fechaSeleccionada = new Date(this.contrato.fechaInicio);
    const fechaHoy = new Date();
    fechaSeleccionada.setHours(0, 0, 0, 0);
    fechaHoy.setHours(0, 0, 0, 0);
    const diaAnterior = new Date(fechaHoy);
    diaAnterior.setDate(fechaHoy.getDate() - 1);
    this.errorFecha = fechaSeleccionada < diaAnterior || fechaSeleccionada > fechaHoy;
  }
  calcularCostoTotal(contrato: Contrato): number {
    return contrato.montoTotal ?? 0;
  }
  
  calcularDuracionMeses(fechaInicio: Date, fechaFin: Date): number {
  const inicio = new Date(fechaInicio);
  const fin = new Date(fechaFin);
  return (fin.getFullYear() - inicio.getFullYear()) * 12 + (fin.getMonth() - inicio.getMonth());
}
}
