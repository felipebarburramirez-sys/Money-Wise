import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { AnalyticsService } from '../../../../core/services/analytics.service';
import type { ResumenFinanciero } from '../../../../core/models/resumen-financiero.model';
import { AuthService } from '../../../../core/services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.page.html',
  styleUrls: ['./dashboard.page.scss'],
  standalone: false,
})
export class DashboardPage implements OnInit, OnDestroy {
  resumen: ResumenFinanciero | null = null;
  loading = true;

  private sub?: Subscription;

  constructor(
    private analytics: AnalyticsService,
    private auth: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.sub = this.analytics.resumenFinanciero$().subscribe((r) => {
      this.resumen = r;
      this.loading = false;
    });
  }

  ngOnDestroy(): void {
    this.sub?.unsubscribe();
  }

  async logout(): Promise<void> {
    await this.auth.logout();
    await this.router.navigateByUrl('/auth/login', { replaceUrl: true });
  }
}
