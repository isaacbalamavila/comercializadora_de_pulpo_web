import { inject, Injectable } from '@angular/core';
import { environment } from '../../../enviroment/enviroment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { EmployeeDetailsDTO, EmployeeDTO } from '@interfaces/Employees/EmployeesDTO';
import { RoleDetailsDTO } from '@interfaces/Employees/RoleDetailsInterface';
import { createEmployeeDTO } from '@interfaces/Employees/CreateEmployeeDTO';
import { EditEmployeeDTO } from '@interfaces/Employees/EditEmployeeDTO';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class EmployeesService {

  //* Injections
  private readonly _http = inject(HttpClient);
  private readonly _authService = inject(AuthService);

  //* Base URL
  private readonly baseURL: string = `${environment.apiUrl}/users`;

  getEmployees(): Observable<EmployeeDTO[]> {
    const employe = this._authService.getUser()

    const headers = new HttpHeaders({
      userId: employe?.id ?? ""
    });

    return this._http.get<EmployeeDTO[]>(this.baseURL, { headers });
  }

  getEmployee(id: string): Observable<EmployeeDetailsDTO> {
    return this._http.get<EmployeeDetailsDTO>(`${this.baseURL}/${id}`);
  }

  changePassword(id: string, newPassword: string): Observable<void> {
    const body = {
      "newPassword": newPassword
    }
    return this._http.patch<void>(`${this.baseURL}/${id}/password/change`, body);
  }

  getRoles(): Observable<RoleDetailsDTO[]> {
    return this._http.get<RoleDetailsDTO[]>(`${environment.apiUrl}/roles`)

  }

  createEmployee(body: createEmployeeDTO): Observable<EmployeeDTO> {
    return this._http.post<EmployeeDTO>(this.baseURL, body);

  }

  editEmployee(employeeId: string, body: EditEmployeeDTO): Observable<EmployeeDetailsDTO> {
    return this._http.put<EmployeeDetailsDTO>(`${this.baseURL}/${employeeId}`, body);
  }

  deleteEmployee(id: string): Observable<void> {
    return this._http.delete<void>(`${this.baseURL}/${id}`)
  }

  restoreEmployee(id: string): Observable<void> {
    return this._http.patch<void>(`${this.baseURL}/${id}/restore`, {})
  }


  resetEmployeePassword(id: string): Observable<void> {
    return this._http.patch<void>(`${this.baseURL}/${id}/password/reset`, {})
  }


}
