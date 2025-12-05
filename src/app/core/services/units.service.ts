import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { UnitDTO } from '@interfaces/Units/UnitDTO';
import { environment } from 'enviroment/enviroment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UnitsService {

  //* Injections
  private readonly _http = inject(HttpClient);

  //* Base URL
  private readonly baseURL: string = `${environment.apiUrl}/units`;

  getUnits(): Observable<UnitDTO[]> {
    return this._http.get<UnitDTO[]>(this.baseURL)
  }
}
