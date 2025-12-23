import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { ProcessDetailsDTO, ProcessDTO, ProcessResponseDTO } from '@interfaces/Process/ProcessInterface';
import { environment } from 'enviroment/enviroment';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class ProcessesService {

  //* Injections
  private readonly _http = inject(HttpClient);
  private readonly _auth = inject(AuthService);

  //* Base URL
  private readonly baseURL: string = `${environment.apiUrl}/process`;

  getProcesses(
    pageSize: number | null,
    page: number | null,
    product: string | null,
    user: string | null,
    status: number | null
  ): Observable<ProcessResponseDTO> {

    let params: any = {};

    if (pageSize != null) params.pageSize = pageSize;
    if (page != null) params.page = page;
    if (product != null && product.trim() !== '') params.product = product;
    if (user != null && user.trim() !== '') params.user = user;
    if (status != null) params.status = status;

    return this._http.get<ProcessResponseDTO>(this.baseURL, { params });
  }

  getProcessDetails(processId: string): Observable<ProcessDetailsDTO> {
    return this._http.get<ProcessDetailsDTO>(`${this.baseURL}/${processId}`);
  }

  createProcess(productId: string, quantity: number): Observable<ProcessDTO> {
    const user = this._auth.getUser();
    const body = {
      "productId": productId,
      "userId": user!.id,
      "quantity": quantity
    }

    return this._http.post<ProcessDTO>(this.baseURL, body);
  }
}
