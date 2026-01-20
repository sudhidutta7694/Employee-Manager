import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
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
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Dashboard {

  private readonly store = inject(Store);
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);

  readonly user = toSignal(this.store.select(selectAuthUser), { initialValue: null });

  logout() {
    this.auth.clearSession();
    // Invalidate session cookie on the API if available (not implemented here)
    this.router.navigate(['/login']);
  }

}
