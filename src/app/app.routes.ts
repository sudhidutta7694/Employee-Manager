import { Routes } from '@angular/router';
import { Login } from './login/login';
import { Layout } from './layout/layout';
import { Dashboard } from './dashboard/dashboard';
import { Employee } from './employee/employee';
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
    component: Login,
    canActivate: [loginRedirectGuard],
    canMatch: [loginRedirectGuard],
  },
  {
    path: '',
    component: Layout,
    children: [
      {
        path: 'dashboard',
        component: Dashboard,
        canActivate: [authGuard],
      },
      {
        path: 'employee',
        component: Employee,
        canActivate: [authGuard],
      },
    ],
  },
];
