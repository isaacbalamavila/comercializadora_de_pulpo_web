import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { DashboardDTO } from '@interfaces/Dashboard';
import { environment } from 'enviroment/enviroment';
import { AuthService } from './auth.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {

  //* Injections
  private readonly _http = inject(HttpClient);
    private readonly _authService = inject(AuthService);

  //* Base URL
  private readonly baseURL: string = `${environment.apiUrl}/dashboard`;

  getDashboard():Observable<DashboardDTO>{
    const employe = this._authService.getUser()

    return this._http.get<DashboardDTO>(`${this.baseURL}/${employe?.id}`);

  }
}
