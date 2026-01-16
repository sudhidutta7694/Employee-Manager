import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { AuthService } from '../auth/auth.service';
import { selectAuthUser } from '../state/auth.selectors.js';

@Component({
  selector: 'app-dashboard',
  imports: [CommonModule, MatCardModule, MatButtonModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class Dashboard {

  private readonly store = inject(Store);
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);

  user$ = this.store.select(selectAuthUser);

  logout() {
    this.auth.clearSession();
    // Invalidate session cookie on the API if available (not implemented here)
    this.router.navigate(['/login']);
  }

}
