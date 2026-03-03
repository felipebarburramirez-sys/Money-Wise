import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { StorageService } from './storage.service';
import { STORAGE_KEYS } from './storage.keys';
import type { StoredUser, User } from '../models/user.model';

export interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
}

type LoginPayload = { email: string; password: string };
type RegisterPayload = { nombre: string; email: string; password: string };

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly state$ = new BehaviorSubject<AuthState>({
    isAuthenticated: false,
    user: null,
  });

  /** Observable para UI / guards */
  readonly authState$ = this.state$.asObservable();

  constructor(private storage: StorageService) {}

  /** Útil para guards (sync) */
  getSnapshot(): AuthState {
    return this.state$.getValue();
  }

  async hydrate(): Promise<void> {
    const session = await this.storage.get<User>(STORAGE_KEYS.AUTH_SESSION);
    if (session) {
      this.state$.next({ isAuthenticated: true, user: session });
    } else {
      this.state$.next({ isAuthenticated: false, user: null });
    }
  }

  async register(payload: RegisterPayload): Promise<User> {
    const existing = await this.storage.get<StoredUser>(STORAGE_KEYS.AUTH_REGISTERED_USER);

    // MVP: un solo usuario registrado local
    if (existing && existing.email.toLowerCase() === payload.email.toLowerCase()) {
      throw new Error('Este correo ya está registrado.');
    }

    const user: StoredUser = {
      id: this.makeId(),
      nombre: payload.nombre.trim(),
      email: payload.email.trim().toLowerCase(),
      role: 'USER',
      password: payload.password,
    };

    await this.storage.set(STORAGE_KEYS.AUTH_REGISTERED_USER, user);

    // Auto-login
    const sessionUser: User = this.stripPassword(user);
    await this.storage.set(STORAGE_KEYS.AUTH_SESSION, sessionUser);
    this.state$.next({ isAuthenticated: true, user: sessionUser });

    return sessionUser;
  }

  async login(payload: LoginPayload): Promise<User> {
    const registered = await this.storage.get<StoredUser>(STORAGE_KEYS.AUTH_REGISTERED_USER);

    // MVP: si no hay usuario registrado, permitir un login “demo” (opcional)
    if (!registered) {
      const demo: User = {
        id: this.makeId(),
        nombre: 'Demo',
        email: payload.email.trim().toLowerCase(),
        role: 'USER',
      };
      await this.storage.set(STORAGE_KEYS.AUTH_SESSION, demo);
      this.state$.next({ isAuthenticated: true, user: demo });
      return demo;
    }

    const email = payload.email.trim().toLowerCase();
    if (registered.email !== email || registered.password !== payload.password) {
      throw new Error('Credenciales inválidas.');
    }

    const sessionUser: User = this.stripPassword(registered);
    await this.storage.set(STORAGE_KEYS.AUTH_SESSION, sessionUser);
    this.state$.next({ isAuthenticated: true, user: sessionUser });

    return sessionUser;
  }

  async logout(): Promise<void> {
    await this.storage.remove(STORAGE_KEYS.AUTH_SESSION);
    this.state$.next({ isAuthenticated: false, user: null });
  }

  private stripPassword(u: StoredUser): User {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...safe } = u;
    return safe;
  }

  private makeId(): string {
    // crypto.randomUUID() funciona en la mayoría de runtimes modernos
    const c = globalThis.crypto as Crypto | undefined;
    if (c?.randomUUID) return c.randomUUID();
    return `mw_${Date.now()}_${Math.random().toString(16).slice(2)}`;
  }
}
