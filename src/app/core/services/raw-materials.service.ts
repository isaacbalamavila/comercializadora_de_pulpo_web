import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { RawMaterialDTO } from '@interfaces/Raw Materials/RawMaterialDTO';
import { environment } from 'enviroment/enviroment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RawMaterialsService {

  //* Base URL
  private readonly baseURL: string = `${environment.apiUrl}/raw-materials`;

  constructor(private readonly _http: HttpClient) { }

  getRawMaterials():Observable<RawMaterialDTO[]>{
    return this._http.get<RawMaterialDTO[]>(this.baseURL);
  }


}
