import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { SharedModule } from '../shared/shared.module';
import { AdminPage } from './admin-page/admin.page';
import { AdminPageRoutingModule } from './admin-routing.module';
import { CreateUserModalComponent } from './components/create-user-modal/create-user-modal.component';
import { DeleteUserModalComponent } from './components/delete-user-modal/delete-user-modal.component';
import { EditUserModalComponent } from './components/edit-user-modal/edit-user-modal.component';




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
