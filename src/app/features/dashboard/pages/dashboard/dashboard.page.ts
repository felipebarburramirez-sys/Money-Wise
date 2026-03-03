import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../../../core/services/auth.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.page.html',
  styleUrls: ['./dashboard.page.scss'],
  standalone: false,
})
export class DashboardPage {
  constructor(private auth: AuthService, private router: Router) {}

  async logout(): Promise<void> {
    await this.auth.logout();
    await this.router.navigateByUrl('/auth/login', { replaceUrl: true });
  }
}
