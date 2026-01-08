import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { ClientsReport, ProductsReport, PurchasesReport, SalesReport, SuppliesReport } from '@interfaces/Reports/ReportsDTO';
import { environment } from 'enviroment/enviroment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ReportsService {

  //* Injections
  private readonly _http = inject(HttpClient);

  //* Base URL
  private readonly baseURL: string = `${environment.apiUrl}/reports`;

  getSalesReport(startDate: Date | string, endDate: Date | string): Observable<SalesReport> {

    const startDateObj = typeof startDate === 'string' ? new Date(startDate + 'T00:00:00') : startDate;
    const endDateObj = typeof endDate === 'string' ? new Date(endDate + 'T00:00:00') : endDate;

    const start = new Date(Date.UTC(
      startDateObj.getFullYear(),
      startDateObj.getMonth(),
      startDateObj.getDate()
    )).toISOString();

    const end = new Date(Date.UTC(
      endDateObj.getFullYear(),
      endDateObj.getMonth(),
      endDateObj.getDate()
    )).toISOString();

    const params: any = {
      'startDate': start,
      'endDate': end
    }
    return this._http.get<SalesReport>(`${this.baseURL}/sales`, { params: params })
  }

  getPurchasesReport(startDate: Date, endDate: Date): Observable<PurchasesReport> {

    const startDateObj = typeof startDate === 'string' ? new Date(startDate + 'T00:00:00') : startDate;
    const endDateObj = typeof endDate === 'string' ? new Date(endDate + 'T00:00:00') : endDate;

    const start = new Date(Date.UTC(
      startDateObj.getFullYear(),
      startDateObj.getMonth(),
      startDateObj.getDate()
    )).toISOString();

    const end = new Date(Date.UTC(
      endDateObj.getFullYear(),
      endDateObj.getMonth(),
      endDateObj.getDate()
    )).toISOString();

    const params: any = {
      'startDate': start,
      'endDate': end
    }
    return this._http.get<PurchasesReport>(`${this.baseURL}/purchases`, { params: params })
  }

  getClientsReport(startDate: Date, endDate: Date): Observable<ClientsReport> {

    const startDateObj = typeof startDate === 'string' ? new Date(startDate + 'T00:00:00') : startDate;
    const endDateObj = typeof endDate === 'string' ? new Date(endDate + 'T00:00:00') : endDate;

    const start = new Date(Date.UTC(
      startDateObj.getFullYear(),
      startDateObj.getMonth(),
      startDateObj.getDate()
    )).toISOString();

    const end = new Date(Date.UTC(
      endDateObj.getFullYear(),
      endDateObj.getMonth(),
      endDateObj.getDate()
    )).toISOString();

    const params: any = {
      'startDate': start,
      'endDate': end
    }
    return this._http.get<ClientsReport>(`${this.baseURL}/clients`, { params: params })
  }

  getProductsReport(startDate: Date, endDate: Date): Observable<ProductsReport> {

    const startDateObj = typeof startDate === 'string' ? new Date(startDate + 'T00:00:00') : startDate;
    const endDateObj = typeof endDate === 'string' ? new Date(endDate + 'T00:00:00') : endDate;

    const start = new Date(Date.UTC(
      startDateObj.getFullYear(),
      startDateObj.getMonth(),
      startDateObj.getDate()
    )).toISOString();

    const end = new Date(Date.UTC(
      endDateObj.getFullYear(),
      endDateObj.getMonth(),
      endDateObj.getDate()
    )).toISOString();

    const params: any = {
      'startDate': start,
      'endDate': end
    }
    return this._http.get<ProductsReport>(`${this.baseURL}/products`, { params: params })
  }

  getSuppliesReport(startDate: Date, endDate: Date): Observable<SuppliesReport> {

    const startDateObj = typeof startDate === 'string' ? new Date(startDate + 'T00:00:00') : startDate;
    const endDateObj = typeof endDate === 'string' ? new Date(endDate + 'T00:00:00') : endDate;

    const start = new Date(Date.UTC(
      startDateObj.getFullYear(),
      startDateObj.getMonth(),
      startDateObj.getDate()
    )).toISOString();

    const end = new Date(Date.UTC(
      endDateObj.getFullYear(),
      endDateObj.getMonth(),
      endDateObj.getDate()
    )).toISOString();

    const params: any = {
      'startDate': start,
      'endDate': end
    }
    return this._http.get<SuppliesReport>(`${this.baseURL}/supplies`, { params: params })
  }
}
