import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { CreateProductDTO } from '@interfaces/Products/CreateProductDTO';
import { ProductDetailsDTO, ProductDTO } from '@interfaces/Products/ProductDTO';
import { UpdateProductDTO } from '@interfaces/Products/UpdatedProductDTO';
import { environment } from 'enviroment/enviroment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProductsService {

  //* Injections
  private readonly _http = inject(HttpClient);

  //* Base URL
  private readonly baseURL: string = `${environment.apiUrl}/products`;

  getProducts(): Observable<ProductDTO[]> {
    return this._http.get<ProductDTO[]>(this.baseURL);
  }

  getActiveProducts(): Observable<ProductDTO[]> {
    return this._http.get<ProductDTO[]>(this.baseURL, { params: { 'onlyActives': true } })
  }

  getProductDetails(id: string): Observable<ProductDetailsDTO> {
    return this._http.get<ProductDetailsDTO>(`${this.baseURL}/${id}`);
  }

  createProduct(body: CreateProductDTO): Observable<ProductDTO> {
    const requestBody = new FormData();
    //* Map body 
    requestBody.append('img', body.img);
    requestBody.append('name', body.name);
    requestBody.append('description', body.description);
    requestBody.append('rawMaterialId', body.rawMaterialId.toString());
    requestBody.append('content', body.content.toString());
    requestBody.append('unitId', body.unitId.toString());
    requestBody.append('price', body.price.toString());
    requestBody.append('stockMin', body.stockMin.toString());
    requestBody.append('rawMaterialNeededKg', body.rawMaterialNeededKg.toString());
    requestBody.append('timeNeededMin', body.timeNeededMin.toString());

    return this._http.post<ProductDTO>(this.baseURL, requestBody);
  }

  updateProduct(id: string, body: UpdateProductDTO): Observable<ProductDetailsDTO> {
    const requestBody = new FormData();

    //* Map body
    requestBody.append('name', body.name);
    requestBody.append('description', body.description);
    requestBody.append('price', body.price.toString());
    requestBody.append('stockMin', body.stockMin.toString());
    //* Image validation
    if (body.img != null)
      requestBody.append('img', body.img!)

    return this._http.put<ProductDetailsDTO>(`${this.baseURL}/${id}`, requestBody);
  }

  deleteProduct(id: string): Observable<void> {
    return this._http.delete<void>(`${this.baseURL}/${id}`);
  }

  restoreProduct(id: string): Observable<void> {
    return this._http.patch<void>(`${this.baseURL}/${id}/restore`, {});
  }




}
