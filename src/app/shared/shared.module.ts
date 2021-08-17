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
import { UnsavedChangesComponent } from './components/unsaved-changes/unsaved-changes.component';
import { BaseDirective } from './directives';
import { BasePageFormDirective } from './directives/base-page-form/base-page-form.directive';
import { FirstCharUppercasePipe } from './pipes/first-char-uppercase.pipe';
import { RoleColorPipe } from './pipes/role-color.pipe';
import { RoleIconPipe } from './pipes/role-icon.pipe';
import { SvgIdPathPipe } from './pipes/svg-id-path.pipe';
import { AddOutlineComponent, CheckComponent, GuestsComponent, LogoComponent, StainFiveComponent, StainFourComponent, StainOneComponent, StainThreeComponent, StainTwoComponent, TakeAwayComponent, WaitingMenuComponent, WaveComponent } from './svg';



@NgModule({
  declarations: [
    ExternalContainerComponent, 
    DefaultPageComponent, 
    RoleIconPipe, 
    SvgIdPathPipe, 
    RoleSegmentComponent, 
    DishesListComponent, 
    AddDishComponent, 
    ModalDefaultContentComponent, 
    FirstCharUppercasePipe, 
    BaseDirective, 
    BasePageFormDirective, 
    UnsavedChangesComponent, 
    LogoComponent, 
    StainOneComponent, 
    StainTwoComponent, 
    StainThreeComponent, 
    GuestsComponent, 
    TakeAwayComponent, 
    WaitingMenuComponent,
    AddOutlineComponent, 
    CheckComponent, 
    StainFourComponent, 
    StainFiveComponent, 
    WaveComponent, RoleColorPipe
  ],
  imports: [
    CommonModule,
    AngularFireAuthModule,
    AngularFirestoreModule,
    IonicModule,
    FormsModule
  ],
  exports: [
    ExternalContainerComponent, 
    RoleIconPipe, 
    RoleColorPipe,
    DefaultPageComponent, 
    SvgIdPathPipe, 
    RoleSegmentComponent, 
    DishesListComponent, 
    ModalDefaultContentComponent, 
    BaseDirective, 
    LogoComponent, 
    StainOneComponent, 
    StainTwoComponent, 
    StainThreeComponent, 
    GuestsComponent, 
    TakeAwayComponent,
    WaitingMenuComponent,
    AddOutlineComponent, 
    CheckComponent,
    StainFourComponent, 
    StainFiveComponent, 
    WaveComponent
  ]
})
export class SharedModule { }
