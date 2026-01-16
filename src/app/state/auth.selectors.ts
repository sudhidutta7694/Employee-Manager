import { createFeatureSelector, createSelector } from '@ngrx/store';
import { AuthState } from './auth.models.js';

export const selectAuthState = createFeatureSelector<AuthState>('auth');

export const selectIsAuthenticated = createSelector(
  selectAuthState,
  (state) => state.isAuthenticated,
);

export const selectAuthUser = createSelector(
  selectAuthState,
  (state) => state.user,
);
