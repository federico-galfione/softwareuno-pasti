import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { SharedModule } from '../shared/shared.module';
import { AdminPage } from './admin-page/admin.page';
import { CreateUserModalComponent } from './admin-page/components/create-user-modal/create-user-modal.component';
import { DeleteUserModalComponent } from './admin-page/components/delete-user-modal/delete-user-modal.component';
import { EditUserModalComponent } from './admin-page/components/edit-user-modal/edit-user-modal.component';
import { AdminPageRoutingModule } from './admin-routing.module';




@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AdminPageRoutingModule,
    SharedModule,
    ReactiveFormsModule
  ],
  declarations: [AdminPage, DeleteUserModalComponent, EditUserModalComponent, CreateUserModalComponent]
})
export class AdminPageModule {}
