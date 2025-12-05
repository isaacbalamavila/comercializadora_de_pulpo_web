import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { RawMaterialDTO } from '@interfaces/Raw Materials/RawMaterialDTO';
import { environment } from 'enviroment/enviroment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RawMaterialsService {

  //* Injections
  private readonly _http = inject(HttpClient);

  //* Base URL
  private readonly baseURL: string = `${environment.apiUrl}/raw-materials`;

  getRawMaterials(): Observable<RawMaterialDTO[]> {
    return this._http.get<RawMaterialDTO[]>(this.baseURL);
  }


}
