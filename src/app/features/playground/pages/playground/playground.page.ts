import { Component, OnInit } from '@angular/core';
import { MessageService } from 'primeng/api';
import { AuthService } from '../../../../core/services/auth.service';
import { TransaccionService } from '../../../../core/services/transaccion.service';
import { AnalyticsService } from '../../../../core/services/analytics.service';
import { StorageService } from '../../../../core/services/storage.service';
import { CATEGORIAS } from '../../../../core/constants/categorias.const';
import { TIPOS_TRANSACCION } from '../../../../core/constants/tipos-transaccion.const';
import { firstValueFrom } from 'rxjs';

type OptionItem = { label: string; value: string };

@Component({
  selector: 'app-playground',
  templateUrl: './playground.page.html',
  styleUrls: ['./playground.page.scss'],
  standalone: false,
})
export class PlaygroundPage implements OnInit {
  name = '';
  selectedCategory: string | null = null;
  selectedDate: Date | null = null;
  showDialog = false;

  categories: OptionItem[] = [
    { label: 'Food', value: 'food' },
    { label: 'Transport', value: 'transport' },
    { label: 'Bills', value: 'bills' },
  ];

  // ====== Parte 2 Core (smoke test)
  authSnapshot: any = null;
  resumenSnapshot: any = null;
  transaccionesSnapshot: any[] = [];

  // forms MVP
  regNombre = 'Duvan';
  regEmail = 'duvan@mail.com';
  regPass = '1234';

  loginEmail = 'duvan@mail.com';
  loginPass = '1234';

  constructor(
    private msg: MessageService,
    private auth: AuthService,
    private tx: TransaccionService,
    private analytics: AnalyticsService,
    private storage: StorageService
  ) {}

  async ngOnInit(): Promise<void> {
    await this.auth.hydrate();
    await this.tx.hydrate();
    await this.refreshSnapshots();
  }

  // ====== Parte 1 UI actions
  toastSuccess() {
    this.msg.add({ severity: 'success', summary: 'OK', detail: 'Toast funcionando ✅' });
  }

  openDialog() {
    this.showDialog = true;
  }

  closeDialog() {
    this.showDialog = false;
  }

  // ====== Parte 2 Core actions
  async doRegister(): Promise<void> {
    try {
      await this.auth.register({
        nombre: this.regNombre,
        email: this.regEmail,
        password: this.regPass,
      });
      this.msg.add({ severity: 'success', summary: 'Register', detail: 'Usuario registrado + login ✅' });
      await this.refreshSnapshots();
    } catch (e: any) {
      this.msg.add({ severity: 'error', summary: 'Register', detail: e?.message ?? 'Error' });
    }
  }

  async doLogin(): Promise<void> {
    try {
      await this.auth.login({
        email: this.loginEmail,
        password: this.loginPass,
      });
      this.msg.add({ severity: 'success', summary: 'Login', detail: 'Login OK ✅' });
      await this.refreshSnapshots();
    } catch (e: any) {
      this.msg.add({ severity: 'error', summary: 'Login', detail: e?.message ?? 'Error' });
    }
  }

  async doLogout(): Promise<void> {
    await this.auth.logout();
    this.msg.add({ severity: 'info', summary: 'Logout', detail: 'Sesión cerrada' });
    await this.refreshSnapshots();
  }

  async seed2Transacciones(): Promise<void> {
    try {
      const cat1 = CATEGORIAS[0]?.key ?? 'ALIMENTACION';
      const cat2 = CATEGORIAS[1]?.key ?? 'TRANSPORTE';

      await this.tx.create({
        tipo: TIPOS_TRANSACCION[0].value, // INGRESO
        categoria: cat1 as any,
        monto: 250000,
        fecha: new Date(),
        nota: 'Ingreso demo',
      });

      await this.tx.create({
        tipo: TIPOS_TRANSACCION[1].value, // GASTO
        categoria: cat2 as any,
        monto: 65000,
        fecha: new Date(),
        nota: 'Gasto demo',
      });

      this.msg.add({ severity: 'success', summary: 'Transacciones', detail: '2 transacciones creadas ✅' });
      await this.refreshSnapshots();
    } catch (e: any) {
      this.msg.add({ severity: 'error', summary: 'Transacciones', detail: e?.message ?? 'Error' });
    }
  }

  async wipeLocal(): Promise<void> {
    await this.storage.clearAll();
    await this.auth.hydrate();
    await this.tx.hydrate();
    this.msg.add({ severity: 'warn', summary: 'Storage', detail: 'Local wipe (mw_*) ✅' });
    await this.refreshSnapshots();
  }

  private async refreshSnapshots(): Promise<void> {
    this.authSnapshot = this.auth.getSnapshot();
    this.transaccionesSnapshot = this.tx.list();

    // tomar 1 valor del resumen reactivo
    this.resumenSnapshot = await firstValueFrom(this.analytics.resumenFinanciero$());
  }
}
