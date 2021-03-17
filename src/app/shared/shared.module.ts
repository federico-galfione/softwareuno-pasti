import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ExternalContainerComponent } from './components/external-container/external-container.component';
import { AuthService } from './services/auth.service';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { ToastService } from './services/toast.service';



@NgModule({
  declarations: [ExternalContainerComponent],
  imports: [
    CommonModule,
    AngularFireAuthModule,
    AngularFirestoreModule
  ],
  exports: [ExternalContainerComponent, AuthService, ToastService]
})
export class SharedModule { }
