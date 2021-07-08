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
import { BaseDirective } from './directives';
import { FirstCharUppercasePipe } from './pipes/first-char-uppercase.pipe';
import { RoleIconPipe } from './pipes/role-icon.pipe';
import { SvgIdPathPipe } from './pipes/svg-id-path.pipe';


@NgModule({
  declarations: [ExternalContainerComponent, DefaultPageComponent, RoleIconPipe, SvgIdPathPipe, RoleSegmentComponent, DishesListComponent, AddDishComponent, ModalDefaultContentComponent, FirstCharUppercasePipe, BaseDirective],
  imports: [
    CommonModule,
    AngularFireAuthModule,
    AngularFirestoreModule,
    IonicModule,
    FormsModule
  ],
  exports: [ExternalContainerComponent, RoleIconPipe, DefaultPageComponent, SvgIdPathPipe, RoleSegmentComponent, DishesListComponent, ModalDefaultContentComponent, BaseDirective]
})
export class SharedModule { }
