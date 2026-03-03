import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { AuthService } from './core/services/auth.service';
import { TransaccionService } from './core/services/transaccion.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
  standalone: false,
})
export class AppComponent implements OnInit {
  constructor(
    private auth: AuthService,
    private tx: TransaccionService,
    private router: Router
  ) {}

  async ngOnInit(): Promise<void> {
    // 1) Hydrate (estado persistido)
    await this.auth.hydrate();
    await this.tx.hydrate();

    // 2) Redirección coherente según auth
    const { isAuthenticated } = this.auth.getSnapshot();
    const url = this.router.url || '/';

    // Si entras a /auth pero ya estás logueado => tabs
    if (isAuthenticated && url.startsWith('/auth')) {
      await this.router.navigateByUrl('/tabs/dashboard', { replaceUrl: true });
      return;
    }

    // Si entras a /tabs pero NO estás logueado => login
    if (!isAuthenticated && url.startsWith('/tabs')) {
      await this.router.navigateByUrl('/auth/login', { replaceUrl: true });
      return;
    }

    // Si estás en raíz, decide
    if (url === '/' || url === '') {
      await this.router.navigateByUrl(
        isAuthenticated ? '/tabs/dashboard' : '/auth/login',
        { replaceUrl: true }
      );
    }
  }
}
