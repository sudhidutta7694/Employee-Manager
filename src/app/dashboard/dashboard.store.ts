import { Injectable, inject } from '@angular/core';
import { ComponentStore } from '@ngrx/component-store';
import { tapResponse } from '@ngrx/operators';
import { Observable, switchMap } from 'rxjs';
import { DashboardState, initialDashboardState } from './dashboard.model';
import { DashboardService } from './dashboard.service';

@Injectable()
export class DashboardStore extends ComponentStore<DashboardState> {
  private dashboardService = inject(DashboardService);

  constructor() {
    super(initialDashboardState);
  }

  // Selectors
  readonly totalEmployee$ = this.select((state) => state.totalEmployee);
  readonly totalProject$ = this.select((state) => state.totalProject);
  readonly recentEmployee$ = this.select((state) => state.recentEmployee);
  readonly loading$ = this.select((state) => state.loading);
  readonly error$ = this.select((state) => state.error);

  // Effects
  readonly getDashboardData = this.effect((trigger$: Observable<void>) => {
    return trigger$.pipe(
      switchMap(() => {
        this.patchState({ loading: true, error: null });
        return this.dashboardService.getDashboardData().pipe(
          tapResponse({
            next: (data) => {
              this.patchState({
                totalEmployee: data.totalEmployee,
                totalProject: data.totalProject,
                recentEmployee: data.recentEmployee,
                loading: false,
              });
            },
            error: (error: any) => {
              this.patchState({
                loading: false,
                error: error.message || 'Failed to fetch dashboard data',
              });
            },
          }),
        );
      }),
    );
  });
}
