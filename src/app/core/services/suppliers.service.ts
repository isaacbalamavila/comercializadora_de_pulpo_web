import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { RequestSupplierDTO } from '@interfaces/Suppliers/CreateSupplierDTO';
import { SupplierDetailsDTO } from '@interfaces/Suppliers/SupplierDTO';
import { SupplierDTO } from '@interfaces/Suppliers/SupplierDTO';
import { environment } from 'enviroment/enviroment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SuppliersService {

  //* Base URL
  private readonly baseURL: string = `${environment.apiUrl}/suppliers`;

  constructor(private readonly _http: HttpClient) {
  }

  getSuppliers(): Observable<SupplierDTO[]> {
    return this._http.get<SupplierDTO[]>(this.baseURL);
  }

  getSupplierDetails(id: string): Observable<SupplierDetailsDTO> {
    return this._http.get<SupplierDetailsDTO>(`${this.baseURL}/${id}`);
  }

  createSupplier(body: RequestSupplierDTO): Observable<SupplierDTO> {
    return this._http.post<SupplierDTO>(this.baseURL, body);
  }

  updateSupplier(id:string,body: RequestSupplierDTO): Observable<SupplierDetailsDTO> {
    return this._http.put<SupplierDetailsDTO>(`${this.baseURL}/${id}`, body);
  }

  deleteSupplier(id: string): Observable<void> {
    return this._http.delete<void>(`${this.baseURL}/${id}`);
  }

  restoreSupplier(id: string): Observable<void> {
    return this._http.patch<void>(`${this.baseURL}/${id}/restore`, {});
  }
}
