import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { SuppliesPaginationResponseDTO, SupplyDetailsDTO, SupplyDTO } from '@interfaces/Supplies Inventory/SupplyDTO';
import { environment } from 'enviroment/enviroment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SuppliesInventoryService {

  //* Injections
  private readonly _http = inject(HttpClient);
  //* Base URL
  private readonly baseURL: string = `${environment.apiUrl}/supplies-inventory`;

  getSupplies(
    pageSize: number | null,
    page: number | null,
    availables: boolean | null,
    rawMaterial: number | null,
    search: string | null
  ): Observable<SuppliesPaginationResponseDTO> {

    let params: any = {};

    if (pageSize != null) params.pageSize = pageSize;
    if (page != null) params.page = page;
    if (availables != null) params.availables = availables;
    if (rawMaterial != null) params.rawMaterial = rawMaterial;
    if (search != null && search.trim() !== '') params.search = search;

    return this._http.get<SuppliesPaginationResponseDTO>(this.baseURL, {
      params: params
    })
  }

  getSupplyDetails(supplyId: string): Observable<SupplyDetailsDTO> {
    return this._http.get<SupplyDetailsDTO>(`${this.baseURL}/${supplyId}`);
  }

  updateWeightRemain(supplyId: string, updateWeight: number): Observable<SupplyDTO> {
    return this._http.put<SupplyDTO>(`${this.baseURL}/${supplyId}`, {
      "updateWeightRemain": updateWeight
    });
  }

  disposeSupllyRemain(supplyId: string): Observable<void> {
    return this._http.delete<void>(`${this.baseURL}/${supplyId}`);
  }
}
