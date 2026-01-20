import { Routes } from '@angular/router';
import { authGuard } from './auth/auth.guard.js';
import { loginRedirectGuard } from './auth/login-redirect.guard.js';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full',
  },
  {
    path: 'login',
    loadComponent: () => import('./login/login').then((m) => m.Login),
    canActivate: [loginRedirectGuard],
    canMatch: [loginRedirectGuard],
  },
  {
    path: '',
    loadComponent: () => import('./layout/layout').then((m) => m.Layout),
    children: [
      {
        path: 'dashboard',
        loadComponent: () => import('./dashboard/dashboard').then((m) => m.Dashboard),
        canActivate: [authGuard],
      },
      {
        path: 'employee',
        loadComponent: () => import('./employee/employee').then((m) => m.Employee),
        canActivate: [authGuard],
      },
    ],
  },
];
