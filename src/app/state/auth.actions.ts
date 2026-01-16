import { createAction, props } from '@ngrx/store';
import { AuthUser } from './auth.models.js';

export const loginSuccess = createAction('[Auth] Login Success', props<{ user: AuthUser }>());
export const logout = createAction('[Auth] Logout');
