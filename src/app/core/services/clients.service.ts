import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ClientDetailsDTO, ClientDTO } from '@interfaces/Clients/ClientDTO';
import { ClientRequestDTO } from '@interfaces/Clients/ClientRequestDTO';
import { GENERAL_PUBLIC_CLIENT_ID } from 'config/constansts';
import { environment } from 'enviroment/enviroment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ClientsService {

  //* Base URL
  private readonly baseURL: string = `${environment.apiUrl}/clients`;

  constructor(private readonly _http: HttpClient) { }

  getClients(): Observable<ClientDTO[]> {
    return this._http.get<ClientDTO[]>(this.baseURL, { params: { 'idExcluded': GENERAL_PUBLIC_CLIENT_ID } });
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
