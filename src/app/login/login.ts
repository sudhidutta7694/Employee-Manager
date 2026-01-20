import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
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

type AuthUserPayload = Partial<{
  employeeId: number;
  employeeName: string;
  contactNo: string;
  emailId: string;
  deptId: number;
  role: string;
  createdDate: string;
}>;

type ApiLoginResponse = {
  Message?: string;
  message?: string;
  Result?: boolean;
  result?: boolean;
  Data?: AuthUserPayload;
  data?: AuthUserPayload;
};

@Component({
  selector: 'app-login',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatCheckboxModule,
    MatProgressSpinnerModule,
  ],
  templateUrl: './login.html',
  styleUrl: './login.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Login {
  readonly loading = signal(false);
  readonly errorMessage = signal('');
  currentYear = new Date().getFullYear();

  // Use a relative URL so Angular's dev proxy can avoid browser CORS issues.
  private readonly apiUrl = '/api/EmployeeManagement/login';
  private readonly http = inject(HttpClient);
  private readonly router = inject(Router);
  private readonly auth = inject(AuthService);
  private readonly fb = inject(NonNullableFormBuilder);

  readonly loginForm = this.fb.group({
    email: this.fb.control('', { validators: [Validators.required, Validators.email] }),
    password: this.fb.control('', { validators: [Validators.required, Validators.minLength(6)] }),
    rememberMe: this.fb.control(true),
  });

  private readonly loginSchema = z.object({
    email: z.string().email('Please enter a valid email address'),
    password: z.string().min(1, 'Password is required'),
  });

  onSubmit() {
    if (this.loginForm.invalid || this.loading()) {
      return;
    }

    const { email, password, rememberMe } = this.loginForm.getRawValue();

    const validation = this.loginSchema.safeParse({ email, password });
    if (!validation.success) {
      this.errorMessage.set(validation.error.issues[0]?.message || 'Please check your credentials.');
      return;
    }

    this.errorMessage.set('');
    this.loading.set(true);

    // API expects userName + password (see curl example)
    const payload = {
      userName: email,
      password,
    };

    this.http
      .post<ApiLoginResponse>(this.apiUrl, payload, { withCredentials: true })
      .pipe(timeout(10000), finalize(() => this.loading.set(false)))
      .subscribe({
        next: (response) => {
          const isSuccess = response?.Result === true || response?.result === true;
          const data: AuthUserPayload | undefined = response?.Data ?? response?.data;

          if (isSuccess) {
            console.info('Login succeeded');
            if (data) {
              const user: AuthUser = {
                employeeId: data.employeeId ?? 0,
                employeeName: data.employeeName ?? email,
                contactNo: data.contactNo,
                emailId: data.emailId ?? email,
                deptId: data.deptId,
                role: data.role,
                createdDate: data.createdDate,
              };
              this.auth.setUser(user);
            }
            this.router.navigate(['/dashboard']);
          } else {
            const serverMessage = response?.Message || response?.message;
            this.errorMessage.set(serverMessage || 'Invalid email or password. Please try again.');
          }
        },
        error: (error: unknown) => {
          console.error('Login request failed', error);

          if (error instanceof TimeoutError) {
            this.errorMessage.set('Login request timed out. Please try again.');
          } else {
            this.errorMessage.set(
              'Unable to sign in at the moment. Please check your connection and try again.',
            );
          }
        },
      });
  }

  onForgotPassword(event: Event) {
    event.preventDefault();
    // Placeholder for forgot-password flow (dialog, route, etc.)
    this.errorMessage.set('Please contact your administrator to reset your password.');
  }

}
