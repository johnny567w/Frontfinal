import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Espacio } from '../../../../../models/espacio.model';
import { EspacioService } from '../../../../espacios/services/espacio.service';

@Component({
  selector: 'app-cajero-gestion-espacios',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './cajero-gestion-espacios.component.html',
  styles: [`
    .container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

.grid-container {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  gap: 15px;
  padding: 20px;
  justify-items: center;
}

.reservado {
  background-color: #fd7e14; /* Tomate */
  color: white;
}


.espacio {
  width: 120px;
  height: 120px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  font-size: 14px;
  text-align: center;
  border: 2px solid #ccc;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
}

.espacio:hover {
  transform: scale(1.05);
}

.disponible {
  background-color: #28a745;
  color: white;
}

.ocupado {
  background-color: #dc3545;
  color: white;
}


.hora-ocupado {
  font-size: 12px;
  margin-top: 8px;
  color: #fdfd96; /* Amarillo claro */
}

.liberar-button {
  margin-top: 8px;
  background-color: white;
  color: red;
  font-size: 12px;
  border: 1px solid red;
  border-radius: 4px;
  cursor: pointer;
  padding: 4px 10px;
  transition: all 0.2s ease;
}

.liberar-button:hover {
  background-color: red;
  color: white;
}

input[type="number"] {
  width: 200px;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
  font-size: 16px;
  margin-right: 10px;
}

button {
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  font-size: 16px;
  cursor: pointer;
  transition: all 0.3s ease;
}

button:hover {
  opacity: 0.9;
}

  `]
})


export class CajeroGestionEspaciosComponent implements OnInit {
  espacios: Espacio[] = [];
  mensajeError: string | null = null;
  mensajeConfirmacion: string | null = null;
  idEspacioOcupar: number | null = null; 
  cedulaClienteOcupar: string = ''; 

  constructor(private espacioService: EspacioService) {}

  ngOnInit() {
    this.cargarEspacios();
  }

  cargarEspacios(): void {
    this.espacioService.getEspacios().subscribe(
      (espacios) => {
        this.espacios = espacios.sort((a, b) => (Number(a.id) || 0) - (Number(b.id) || 0));
        console.log('Espacios cargados:', this.espacios);
      },
      (error) => {
        console.error('Error al cargar los espacios:', error);
        this.mostrarMensajeError('Error al cargar la lista de espacios.');
      }
    );
  }

  ocuparEspacio(id: any): void {
    const espacio = this.espacios.find(e => e.id === Number(id));
    if (!espacio || espacio.ocupado || espacio.reservado) return;

    espacio.ocupado = true;
    this.espacioService.updateEspacio(espacio).subscribe(() => {
      this.mostrarMensajeConfirmacion(`Espacio ${id} ocupado.`);
      this.cargarEspacios();
    });
  }

  liberarEspacio(id: any): void {
    const espacio = this.espacios.find(e => e.id === Number(id));
    if (!espacio || !espacio.ocupado) return;

    espacio.ocupado = false;
    this.espacioService.updateEspacio(espacio).subscribe(() => {
      this.mostrarMensajeConfirmacion(`Espacio ${id} liberado.`);
      this.cargarEspacios();
    });
  }

  reservarEspacio(id: any): void {
    const espacio = this.espacios.find(e => e.id === Number(id));
    if (!espacio || espacio.reservado || espacio.ocupado) return;

    espacio.reservado = true;
    this.espacioService.updateEspacio(espacio).subscribe(() => {
      this.mostrarMensajeConfirmacion(`Espacio ${id} reservado.`);
      this.cargarEspacios();
    });
  }

  cancelarReserva(id: any): void {
    const espacio = this.espacios.find(e => e.id === Number(id));
    if (!espacio || !espacio.reservado) return;

    espacio.reservado = false;
    this.espacioService.updateEspacio(espacio).subscribe(() => {
      this.mostrarMensajeConfirmacion(`Reserva del espacio ${id} cancelada.`);
      this.cargarEspacios();
    });
  }

  eliminarEspacio(id: number): void {
    this.espacioService.deleteEspacio(id).subscribe(
      () => {
        this.espacios = this.espacios.filter(e => e.id !== id);
        this.mostrarMensajeConfirmacion(`El espacio ${id} ha sido eliminado.`);
      },
      (error) => {
        console.error('Error al eliminar el espacio:', error);
        this.mostrarMensajeError(`No se pudo eliminar el espacio ${id}.`);
      }
    );
  }

  mostrarMensajeError(mensaje: string) {
    this.mensajeError = mensaje;
    setTimeout(() => {
      this.mensajeError = null;
    }, 5000);
  }

  mostrarMensajeConfirmacion(mensaje: string) {
    this.mensajeConfirmacion = mensaje;
    setTimeout(() => {
      this.mensajeConfirmacion = null;
    }, 5000);
  }
}