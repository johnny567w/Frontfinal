import { Component, OnInit } from '@angular/core';
import { Contrato } from '../../../../models/contrato.model';
import { ContratosService } from '../../services/contratos.service';

@Component({
  selector: 'app-contrato-list',
  standalone: true,
  imports: [],
  templateUrl: './contrato-list.component.html',
})
export class ContratoListComponent implements OnInit {
  contratos: Contrato[] = [];
  contratosFiltrados: Contrato[] = [];
  usuarioSeleccionado: string = '';

  constructor(private contratosService: ContratosService) {}

  ngOnInit(): void {
    this.obtenerContratos();
  }

  obtenerContratos(): void {
    this.contratosService.getContratos().subscribe((contratos: Contrato[]) => {
      this.contratos = contratos;
      this.contratosFiltrados = contratos;
    });
  }

  filtrarContratos(): void {
    if (this.usuarioSeleccionado) {
      this.contratosFiltrados = this.contratos.filter(
        (contrato) => contrato.usuario.id.toString() === this.usuarioSeleccionado
      );
    } else {
      this.contratosFiltrados = this.contratos;
    }
  }
}