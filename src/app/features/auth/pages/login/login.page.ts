import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { AuthService } from '../../../../core/services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: false,
})
export class LoginPage {
  email = '';
  password = '';
  loading = false;

  constructor(
    private auth: AuthService,
    private router: Router,
    private msg: MessageService
  ) {}

  async submit(): Promise<void> {
    if (!this.email.trim() || !this.password) {
      this.msg.add({
        severity: 'warn',
        summary: 'Campos requeridos',
        detail: 'Email y contraseña son obligatorios.',
      });
      return;
    }

    this.loading = true;

    try {
      await this.auth.login({
        email: this.email,
        password: this.password,
      });

      this.msg.add({
        severity: 'success',
        summary: 'Login',
        detail: 'Sesión iniciada ✅',
      });

      await this.router.navigateByUrl('/tabs/dashboard', { replaceUrl: true });
    } catch (e: any) {
      this.msg.add({
        severity: 'error',
        summary: 'Login',
        detail: e?.message ?? 'Error al iniciar sesión',
      });
    } finally {
      this.loading = false;
    }
  }

  goRegister(): void {
    this.router.navigateByUrl('/auth/register');
  }
}
