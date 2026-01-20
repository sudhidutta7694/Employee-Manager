import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { DashboardState } from './dashboard.model';

@Injectable({
  providedIn: 'root',
})
export class DashboardService {
  private http = inject(HttpClient);

  getDashboardData(): Observable<DashboardState> {
    return this.http.get<DashboardState>('/api/EmployeeManagement/GetDashboard');
  }
}
