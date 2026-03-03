import { NgModule, Optional, SkipSelf } from '@angular/core';

@NgModule({
  providers: [],
})
export class CoreModule {
  constructor(@Optional() @SkipSelf() parentModule: CoreModule | null) {
    if (parentModule) {
      throw new Error('CoreModule ya fue importado. Debe importarse SOLO en AppModule.');
    }
  }
}
