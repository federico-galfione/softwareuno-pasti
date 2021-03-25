import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ExternalContainerComponent } from './components/external-container/external-container.component';
import { AuthService } from './services/auth.service';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { ToastService } from './services/toast.service';
import { DefaultPageComponent } from './components/default-page/default-page.component';
import { RoleIconPipe } from './pipes/role-icon.pipe';
import { SvgIdPathPipe } from './pipes/svg-id-path.pipe';
import { PopupComponent } from './components/popup/popup.component';
import { RoleSegmentComponent } from './components/role-segment/role-segment.component';
import { MediaService } from './services/media.service';
import { DishesListComponent } from './components/dishes-list/dishes-list.component';



@NgModule({
  declarations: [ExternalContainerComponent, DefaultPageComponent, RoleIconPipe, SvgIdPathPipe, PopupComponent, RoleSegmentComponent, DishesListComponent],
  imports: [
    CommonModule,
    AngularFireAuthModule,
    AngularFirestoreModule
  ],
  exports: [ExternalContainerComponent, RoleIconPipe, DefaultPageComponent, AuthService, ToastService, SvgIdPathPipe, PopupComponent, RoleSegmentComponent, MediaService, DishesListComponent]
})
export class SharedModule { }
