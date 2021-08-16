import { NgModule } from '@angular/core';
import { AngularFireModule } from '@angular/fire';
import { AngularFireFunctionsModule, NEW_ORIGIN_BEHAVIOR, ORIGIN } from '@angular/fire/functions';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouteReuseStrategy } from '@angular/router';
import { ServiceWorkerModule } from '@angular/service-worker';
import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { environment } from '../environments/environment';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';



@NgModule({
  declarations: [AppComponent],
  entryComponents: [],
  imports: [
    BrowserModule, 
    BrowserAnimationsModule, 
    IonicModule.forRoot(), 
    AppRoutingModule, 
    ServiceWorkerModule.register('ngsw-worker.js', { enabled: environment.production }), 
    AngularFireModule.initializeApp(environment.firebase),
    AngularFireFunctionsModule
  ],
  providers: [
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    // { provide: USE_EMULATOR, useValue: environment.useEmulator ? ['localhost', 5001] : undefined },
    { provide: NEW_ORIGIN_BEHAVIOR, useValue: true },
    { provide: ORIGIN, useFactory: () => !environment.production ? undefined : location.origin },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
