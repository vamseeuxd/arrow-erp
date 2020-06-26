import { ModuleWithProviders, NgModule } from "@angular/core";
import { AngularFireModule } from "@angular/fire";
import { environment } from "../../environments/environment";
import { NgxMaskModule, IConfig } from "ngx-mask";
import { AngularFirestoreModule } from "@angular/fire/firestore";
import { NgxLoaderIndicatorModule } from "ngx-loader-indicator";
import { AngularFireStorageModule } from "@angular/fire/storage";

const maskConfig: Partial<IConfig> = {
  validation: false,
};

@NgModule({
  imports: [
    AngularFireModule.initializeApp(environment.firebase),
    AngularFirestoreModule.enablePersistence(),
    NgxLoaderIndicatorModule.forRoot({}),
    AngularFireStorageModule,
    NgxMaskModule.forRoot(maskConfig),
  ],
  exports: [
    AngularFireModule,
    NgxMaskModule,
    NgxLoaderIndicatorModule,
    AngularFirestoreModule,
    AngularFireStorageModule,
  ],
})
export class ArrowFirebaseModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: ArrowFirebaseModule,
      providers: [],
    };
  }
}
