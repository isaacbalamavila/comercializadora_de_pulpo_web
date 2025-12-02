import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { UnitDTO } from '@interfaces/Units/UnitDTO';
import { environment } from 'enviroment/enviroment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UnitsService {

  //* Base URL
  private readonly baseURL: string = `${environment.apiUrl}/units`;

  constructor(private readonly _http: HttpClient) {
  }

  getUnits():Observable<UnitDTO[]>{
    return this._http.get<UnitDTO[]>(this.baseURL)
  }
}
