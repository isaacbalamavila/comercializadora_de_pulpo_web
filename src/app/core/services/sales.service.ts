import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { MakeSaleDTO, SaleItem } from '@interfaces/Sales/MakeSaleDTO';
import { SaleDetailsDTO, SalesResponse } from '@interfaces/Sales/SaleDTO';
import { environment } from 'enviroment/enviroment';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class SalesService {

  //* Injections
  private readonly _http = inject(HttpClient);
  private readonly _authService = inject(AuthService);

  //* Base URL
  private readonly baseURL: string = `${environment.apiUrl}/sales`;


  getSales(pageSize: number | null, page: number | null, employeeId: string | null, clientId: string | null, date: string | null): Observable<SalesResponse> {

    let params: any = {};

    if (pageSize != null) params.pageSize = pageSize;
    if (page != null) params.page = page;
    if (employeeId != null) params.employeeId = employeeId;
    if (clientId != null) params.clientId = clientId;
    if (date != null) params.date = date;

    return this._http.get<SalesResponse>(this.baseURL, { params: params });
  }

  getSaleDetails(id: string): Observable<SaleDetailsDTO> {
    return this._http.get<SaleDetailsDTO>(`${this.baseURL}/${id}`);
  }

  makeSale(clientId: string, paymentMethod: number, products: SaleItem[]): Observable<SaleDetailsDTO> {

    const employe = this._authService.getUser()
    const body: MakeSaleDTO = {
      userId: employe!.id,
      clientId: clientId,
      paymentMethodId: paymentMethod,
      products: products
    }

    return this._http.post<SaleDetailsDTO>(this.baseURL, body);
  }
}
