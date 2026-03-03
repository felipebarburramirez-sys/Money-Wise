import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { AuthService } from '../../../../core/services/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
  standalone: false,
})
export class RegisterPage {
  nombre = '';
  email = '';
  password = '';
  loading = false;

  constructor(
    private auth: AuthService,
    private router: Router,
    private msg: MessageService
  ) {}

  async submit(): Promise<void> {
    if (!this.nombre.trim() || !this.email.trim() || !this.password) {
      this.msg.add({
        severity: 'warn',
        summary: 'Campos requeridos',
        detail: 'Nombre, email y contraseña son obligatorios.',
      });
      return;
    }

    this.loading = true;

    try {
      await this.auth.register({
        nombre: this.nombre,
        email: this.email,
        password: this.password,
      });

      this.msg.add({
        severity: 'success',
        summary: 'Registro',
        detail: 'Usuario creado + sesión iniciada ✅',
      });

      await this.router.navigateByUrl('/tabs/dashboard', { replaceUrl: true });
    } catch (e: any) {
      this.msg.add({
        severity: 'error',
        summary: 'Registro',
        detail: e?.message ?? 'Error al registrar',
      });
    } finally {
      this.loading = false;
    }
  }

  goLogin(): void {
    this.router.navigateByUrl('/auth/login');
  }
}
