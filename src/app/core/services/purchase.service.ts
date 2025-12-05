import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { CreatePurchaseDTO, CreatePurchaseRequest } from '@interfaces/Purchases/CreatePurchaseDTO';
import { PurchaseDetailsDTO, PurchaseDTO, PurchasePaginationResposne } from '@interfaces/Purchases/PurchaseDTO';
import { environment } from 'enviroment/enviroment';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class PurchaseService {

  //* Injections
  private readonly _http = inject(HttpClient);
  private readonly _auth = inject(AuthService);

  //* Base URL
  private readonly baseURL: string = `${environment.apiUrl}/purchases`;

  getPurchases(
    pageSize: number | null,
    page: number | null,
    date: string | null,
    rawMaterial: number | null,
    supplier: string | null,
    search: string | null
  ): Observable<PurchasePaginationResposne> {

    let params: any = {};

    if (pageSize != null) params.pageSize = pageSize;
    if (page != null) params.page = page;
    if (date != null) params.date = date;
    if (rawMaterial != null) params.rawMaterial = rawMaterial;
    if (supplier != null && supplier.trim() !== '') params.supplier = supplier;
    if (search != null && search.trim() !== '') params.search = search;

    return this._http.get<PurchasePaginationResposne>(this.baseURL, { params });
  }

  getPurchaseDetails(id: string): Observable<PurchaseDetailsDTO> {
    return this._http.get<PurchaseDetailsDTO>(`${this.baseURL}/${id}`);
  }

  createPurchase(body: CreatePurchaseDTO): Observable<PurchaseDTO> {
    const user = this._auth.getUser();

    const request: CreatePurchaseRequest = {
      ...body,
      userId: user!.id
    }

    return this._http.post<PurchaseDTO>(this.baseURL, request);

  }
}