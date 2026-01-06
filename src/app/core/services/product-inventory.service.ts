import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { ProductBatchDetails } from '@interfaces/Product Inventory/ProductBatchDetails';
import { ProductBatchResponse } from '@interfaces/Product Inventory/ProductBatches';
import { ProductInventory } from '@interfaces/Product Inventory/ProductInventory';
import { environment } from 'enviroment/enviroment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProductInventoryService {

  //* Injections
  private readonly _http = inject(HttpClient);

  //* Base URL
  private readonly baseURL: string = `${environment.apiUrl}/product-inventory`;

  getProductBatchInventory(
    pageSize: number | null,
    page: number | null,
    availables: boolean | null,
    search: string | null,
    product: string | null
  ): Observable<ProductBatchResponse> {

    let params: any = {};

    if (pageSize != null) params.pageSize = pageSize;
    if (page != null) params.page = page;
    if (availables != null) params.availables = availables;
    if (search != null && search.trim() !== '') params.search = search;
    if (product != null) params.productId = product;

    return this._http.get<ProductBatchResponse>(`${this.baseURL}/batches`, {
      params: params
    })
  }

  getProductInventory(): Observable<ProductInventory[]> {
    return this._http.get<ProductInventory[]>(this.baseURL);
  }

  getProductBatchDetails(id: string): Observable<ProductBatchDetails> {
    return this._http.get<ProductBatchDetails>(`${this.baseURL}/batches/${id}`)
  }

  updateProductBatchRemain(id: string, updatedRemain: number): Observable<void> {
    return this._http.patch<void>(`${this.baseURL}/batches/${id}`, {
      updatedRemain: updatedRemain
    })
  }

  disposeProductBatch(id: string): Observable<void> {
    return this._http.delete<void>(`${this.baseURL}/batches/${id}`)
  }

}
