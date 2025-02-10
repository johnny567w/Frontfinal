import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Contrato } from '../../../models/contrato.model';

@Injectable({
  providedIn: 'root'
})
export class ContratosService {
  private baseUrl = 'http://localhost:8080/api/contratos';

  constructor(private http : HttpClient) { }

  getContratos() : Observable<Contrato[]> {
    return this.http.get<Contrato[]>(this.baseUrl);
  }

  getContratoById(id : Number) : Observable<Contrato> {
    return this.http.get<Contrato>(`${this.baseUrl}/${id}`);
  }

  createContrato(contrato : Contrato ) : Observable<Contrato> {
    return this.http.post<Contrato>(this.baseUrl, contrato);
  }

  cupdateContrato(contrato : Contrato ) : Observable<Contrato> {
    return this.http.put<Contrato>(this.baseUrl, contrato);
  }

  deleteEspacio(id : Number) : Observable<void>{
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}
