import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
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
  loading = false;
  showPassword = false;

  form = this.fb.group({
    nombre: ['', [Validators.required, Validators.minLength(2)]],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(4)]],
  });

  constructor(
    private fb: FormBuilder,
    private auth: AuthService,
    private router: Router,
    private msg: MessageService
  ) {}

  get f() {
    return this.form.controls;
  }

  async submit(): Promise<void> {
    if (this.loading) return;

    this.form.markAllAsTouched();
    if (this.form.invalid) {
      this.msg.add({
        severity: 'warn',
        summary: 'Revisa el formulario',
        detail: 'Hay campos inválidos o vacíos.',
      });
      return;
    }

    this.loading = true;

    try {
      const nombre = this.f.nombre.value?.trim() ?? '';
      const email = this.f.email.value?.trim() ?? '';
      const password = this.f.password.value ?? '';

      await this.auth.register({ nombre, email, password });

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

  togglePassword(): void {
    this.showPassword = !this.showPassword;
  }
}
