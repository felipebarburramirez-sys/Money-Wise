import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService, ConfirmationService } from 'primeng/api';

import { TransaccionService } from '../../../../core/services/transaccion.service';
import type { Transaccion } from '../../../../core/models/transaccion.model';
import { CameraService } from '../../../../core/services/camera.service';
import { FileSystemService } from '../../../../core/services/file-system.service';

@Component({
  selector: 'app-detalle-transaccion',
  templateUrl: './detalle-transaccion.page.html',
  styleUrls: ['./detalle-transaccion.page.scss'],
  standalone: false,
})
export class DetalleTransaccionPage implements OnInit {
  id = this.route.snapshot.paramMap.get('id') ?? '';
  item: Transaccion | null = null;

  savingPhoto = false;
  galleryOpen = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private tx: TransaccionService,
    private msg: MessageService,
    private confirm: ConfirmationService,
    private camera: CameraService,
    private fs: FileSystemService
  ) {}

  async ngOnInit(): Promise<void> {
    await this.tx.hydrate();
    this.item = this.tx.getById(this.id);
    if (!this.item) {
      this.msg.add({ severity: 'warn', summary: 'No encontrada', detail: 'Transacción no existe.' });
      await this.router.navigateByUrl('/tabs/transacciones', { replaceUrl: true });
    }
  }

  back(): void {
    this.router.navigateByUrl('/tabs/transacciones');
  }

  confirmDelete(): void {
    if (!this.item) return;

    this.confirm.confirm({
      header: 'Eliminar transacción',
      message: '¿Seguro que deseas eliminar esta transacción? (Se borrarán sus comprobantes)',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Eliminar',
      rejectLabel: 'Cancelar',
      accept: async () => {
        await this.tx.delete(this.item!.id);
        this.msg.add({ severity: 'info', summary: 'Eliminada', detail: 'Transacción eliminada.' });
        await this.router.navigateByUrl('/tabs/transacciones', { replaceUrl: true });
      },
    });
  }

  openGallery(): void {
    this.galleryOpen = true;
  }

  async addFromCamera(): Promise<void> {
    if (!this.item || this.savingPhoto) return;
    this.savingPhoto = true;

    try {
      const photo = await this.camera.takePhoto();
      if (!photo.webPath) throw new Error('No se pudo obtener la foto.');

      const saved = await this.fs.saveImageFromWebPath(photo.webPath, 'receipts');
      this.item = await this.tx.addComprobante(this.item.id, { path: saved.path, webViewPath: saved.webViewPath });

      this.msg.add({ severity: 'success', summary: 'Comprobante', detail: 'Foto guardada ✅' });
    } catch (e: any) {
      this.msg.add({ severity: 'error', summary: 'Comprobante', detail: e?.message ?? 'Error guardando foto' });
    } finally {
      this.savingPhoto = false;
    }
  }

  async addFromGallery(): Promise<void> {
    if (!this.item || this.savingPhoto) return;
    this.savingPhoto = true;

    try {
      const photo = await this.camera.pickFromGallery();
      if (!photo.webPath) throw new Error('No se pudo obtener la imagen.');

      const saved = await this.fs.saveImageFromWebPath(photo.webPath, 'receipts');
      this.item = await this.tx.addComprobante(this.item.id, { path: saved.path, webViewPath: saved.webViewPath });

      this.msg.add({ severity: 'success', summary: 'Comprobante', detail: 'Imagen guardada ✅' });
    } catch (e: any) {
      this.msg.add({ severity: 'error', summary: 'Comprobante', detail: e?.message ?? 'Error guardando imagen' });
    } finally {
      this.savingPhoto = false;
    }
  }

  async removeComprobante(comprobanteId: string): Promise<void> {
    if (!this.item) return;

    this.confirm.confirm({
      header: 'Eliminar comprobante',
      message: '¿Eliminar esta foto?',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Eliminar',
      rejectLabel: 'Cancelar',
      accept: async () => {
        this.item = await this.tx.removeComprobante(this.item!.id, comprobanteId);
        this.msg.add({ severity: 'info', summary: 'Comprobante', detail: 'Foto eliminada.' });
      },
    });
  }
}
