import { APP_INITIALIZER, NgModule, Optional, SkipSelf } from '@angular/core';
import { IonicStorageModule } from '@ionic/storage-angular';
import { StorageService } from './services/storage.service';

export function initStorage(storageService: StorageService) {
  return () => storageService.init();
}

@NgModule({
  imports: [
    IonicStorageModule.forRoot({
      name: '__moneywise',
      storeName: '__mw_store',
    }),
  ],
  providers: [
    {
      provide: APP_INITIALIZER,
      useFactory: initStorage,
      deps: [StorageService],
      multi: true,
    },
  ],
})
export class CoreModule {
  constructor(@Optional() @SkipSelf() parentModule: CoreModule | null) {
    if (parentModule) {
      throw new Error('CoreModule ya fue importado. Debe importarse SOLO en AppModule.');
    }
  }
}
