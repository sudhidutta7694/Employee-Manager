import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { TimeoutError, timeout } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { z } from 'zod';
import { AuthService } from '../auth/auth.service';
import { AuthUser } from '../state/auth.models.js';

@Component({
  selector: 'app-login',
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatCheckboxModule,
    MatProgressSpinnerModule,
  ],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {

  email = '';
  password = '';
  rememberMe = true;
  loading = false;
  errorMessage = '';
  currentYear = new Date().getFullYear();

  // Use a relative URL so Angular's dev proxy can avoid browser CORS issues.
  private readonly apiUrl = '/api/EmployeeManagement/login';
  private readonly http = inject(HttpClient);
  private readonly router = inject(Router);
  private readonly auth = inject(AuthService);

  private readonly loginSchema = z.object({
    email: z.string().email('Please enter a valid email address'),
    password: z.string().min(1, 'Password is required'),
  });

  onSubmit(form: NgForm) {
    if (form.invalid || this.loading) {
      return;
    }

    const validation = this.loginSchema.safeParse({ email: this.email, password: this.password });
    if (!validation.success) {
      this.errorMessage = validation.error.issues[0]?.message || 'Please check your credentials.';
      return;
    }

    this.errorMessage = '';
    this.loading = true;

    // API expects userName + password (see curl example)
    const payload = {
      userName: this.email,
      password: this.password,
    };

    this.http
      .post<{ Message?: string; message?: string; Result?: boolean; result?: boolean; Data?: unknown; data?: unknown }>(
        this.apiUrl,
        payload,
        { withCredentials: true },
      )
      .pipe(timeout(10000), finalize(() => (this.loading = false)))
      .subscribe({
        next: (response) => {
          const isSuccess = response?.Result === true || response?.result === true;
          const data: any = response?.Data ?? response?.data;

          if (isSuccess) {
            console.info('Login succeeded');
            if (data) {
              const user: AuthUser = {
                employeeId: data.employeeId ?? 0,
                employeeName: data.employeeName ?? this.email,
                contactNo: data.contactNo,
                emailId: data.emailId ?? this.email,
                deptId: data.deptId,
                role: data.role,
                createdDate: data.createdDate,
              };
              this.auth.setUser(user);
            }
            this.router.navigate(['/dashboard']);
          } else {
            const serverMessage = response?.Message || response?.message;
            this.errorMessage = serverMessage || 'Invalid email or password. Please try again.';
          }
        },
        error: (error: unknown) => {
          console.error('Login request failed', error);

          if (error instanceof TimeoutError) {
            this.errorMessage = 'Login request timed out. Please try again.';
          } else {
            this.errorMessage =
              'Unable to sign in at the moment. Please check your connection and try again.';
          }
        },
      });
  }

  onForgotPassword(event: Event) {
    event.preventDefault();
    // Placeholder for forgot-password flow (dialog, route, etc.)
    this.errorMessage = 'Please contact your administrator to reset your password.';
  }

}
