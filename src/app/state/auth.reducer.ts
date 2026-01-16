import { createReducer, on } from '@ngrx/store';
import { AuthState } from './auth.models.js';
import { loginSuccess, logout } from './auth.actions.js';

export const initialAuthState: AuthState = {
  user: null,
  isAuthenticated: false,
};

export const authReducer = createReducer(
  initialAuthState,
  on(loginSuccess, (state, { user }) => ({ ...state, user, isAuthenticated: true })),
  on(logout, () => initialAuthState),
);
