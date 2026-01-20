import { Component, OnInit, inject } from '@angular/core';
import { AsyncPipe, DatePipe, JsonPipe } from '@angular/common';
import { Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatToolbarModule } from '@angular/material/toolbar';
import { DashboardStore } from './dashboard.store';
import { AuthService } from '../auth/auth.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    AsyncPipe,
    DatePipe,
    MatCardModule,
    MatTableModule,
    MatIconModule,
    MatButtonModule,
    MatGridListModule,
    MatToolbarModule,
  ],
  providers: [DashboardStore],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class Dashboard implements OnInit {
  readonly store = inject(DashboardStore);
  readonly authService = inject(AuthService);
  readonly router = inject(Router);

  readonly totalEmployee$ = this.store.totalEmployee$;
  readonly totalProject$ = this.store.totalProject$;
  readonly recentEmployee$ = this.store.recentEmployee$;
  readonly loading$ = this.store.loading$;

  displayedColumns: string[] = ['name', 'email', 'role', 'joined'];

  ngOnInit(): void {
    this.store.getDashboardData();
  }

  logout() {
    this.authService.clearSession();
    this.router.navigate(['/login']);
  }
}
