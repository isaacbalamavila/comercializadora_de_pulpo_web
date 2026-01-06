import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { ClientDetailsDTO, ClientDTO } from '@interfaces/Clients/ClientDTO';
import { ClientRequestDTO } from '@interfaces/Clients/ClientRequestDTO';
import { GENERAL_PUBLIC_CLIENT_ID } from 'config/constansts';
import { environment } from 'enviroment/enviroment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ClientsService {

  //* Injections
  private readonly _http = inject(HttpClient);

  //* Base URL
  private readonly baseURL: string = `${environment.apiUrl}/clients`;

  getClients(): Observable<ClientDTO[]> {
    return this._http.get<ClientDTO[]>(this.baseURL, { params: { 'idExcluded': GENERAL_PUBLIC_CLIENT_ID } });
  }

  getAllClients(): Observable<ClientDTO[]> {
    return this._http.get<ClientDTO[]>(this.baseURL);
  }

  getClient(id: string): Observable<ClientDetailsDTO> {
    return this._http.get<ClientDetailsDTO>(`${this.baseURL}/${id}`)
  }

  createClient(body: ClientRequestDTO): Observable<ClientDTO> {
    return this._http.post<ClientDTO>(`${this.baseURL}`, body);
  }

  updateClient(clientId: string, body: ClientRequestDTO): Observable<ClientDetailsDTO> {
    return this._http.put<ClientDetailsDTO>(`${this.baseURL}/${clientId}`, body);
  }

  deleteClient(id: string): Observable<void> {
    return this._http.delete<void>(`${this.baseURL}/${id}`);
  }

  restoreClient(id: string): Observable<void> {
    return this._http.patch<void>(`${this.baseURL}/${id}/restore`, {});
  }

}
