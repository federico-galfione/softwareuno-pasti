import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { AddDishComponent } from './components/add-dish/add-dish.component';
import { DefaultPageComponent } from './components/default-page/default-page.component';
import { DishesListComponent } from './components/dishes-list/dishes-list.component';
import { ExternalContainerComponent } from './components/external-container/external-container.component';
import { ModalDefaultContentComponent } from './components/modal-default-content/modal-default-content.component';
import { RoleSegmentComponent } from './components/role-segment/role-segment.component';
import { RoleIconPipe } from './pipes/role-icon.pipe';
import { SvgIdPathPipe } from './pipes/svg-id-path.pipe';
import { AuthService } from './services/auth.service';
import { MediaService } from './services/media.service';
import { ToastService } from './services/toast.service';
import { FirstCharUppercasePipe } from './pipes/first-char-uppercase.pipe';


@NgModule({
  declarations: [ExternalContainerComponent, DefaultPageComponent, RoleIconPipe, SvgIdPathPipe, RoleSegmentComponent, DishesListComponent, AddDishComponent, ModalDefaultContentComponent, FirstCharUppercasePipe],
  imports: [
    CommonModule,
    AngularFireAuthModule,
    AngularFirestoreModule,
    IonicModule,
    FormsModule
  ],
  exports: [ExternalContainerComponent, RoleIconPipe, DefaultPageComponent, AuthService, ToastService, SvgIdPathPipe, RoleSegmentComponent, MediaService, DishesListComponent]
})
export class SharedModule { }
