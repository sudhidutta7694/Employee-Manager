import { inject, Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { loginSuccess, logout } from '../state/auth.actions.js';
import { AuthUser } from '../state/auth.models.js';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly store = inject(Store);

  private readonly storageKey = 'auth:user';
  private readonly maxAgeMs = 24 * 60 * 60 * 1000; // 1 day

  setUser(user: AuthUser) {
    this.store.dispatch(loginSuccess({ user }));
    const record = { user, ts: Date.now() };
    sessionStorage.setItem(this.storageKey, JSON.stringify(record));
  }

  clearSession() {
    this.store.dispatch(logout());
    sessionStorage.removeItem(this.storageKey);
  }

  hydrateFromStorage() {
    if (typeof sessionStorage === 'undefined') return;

    const raw = sessionStorage.getItem(this.storageKey);
    if (!raw) return;
    try {
      const parsed = JSON.parse(raw) as { user: AuthUser; ts: number };
      if (!parsed?.user || !parsed?.ts) return;
      const isFresh = Date.now() - parsed.ts < this.maxAgeMs;
      if (!isFresh) {
        sessionStorage.removeItem(this.storageKey);
        return;
      }
      this.store.dispatch(loginSuccess({ user: parsed.user }));
    } catch (err) {
      sessionStorage.removeItem(this.storageKey);
    }
  }
}
