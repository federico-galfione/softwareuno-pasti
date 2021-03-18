import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ExternalContainerComponent } from './components/external-container/external-container.component';
import { AuthService } from './services/auth.service';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { ToastService } from './services/toast.service';
import { DefaultPageComponent } from './components/default-page/default-page.component';



@NgModule({
  declarations: [ExternalContainerComponent, DefaultPageComponent],
  imports: [
    CommonModule,
    AngularFireAuthModule,
    AngularFirestoreModule
  ],
  exports: [ExternalContainerComponent, DefaultPageComponent, AuthService, ToastService]
})
export class SharedModule { }
