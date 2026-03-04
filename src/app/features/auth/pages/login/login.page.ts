import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
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
  loading = false;
  showPassword = false;

  form = this.fb.group({
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
      const email = this.f.email.value?.trim() ?? '';
      const password = this.f.password.value ?? '';

      await this.auth.login({ email, password });

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

  togglePassword(): void {
    this.showPassword = !this.showPassword;
  }
}
