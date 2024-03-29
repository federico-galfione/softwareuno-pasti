import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { SharedModule } from '../shared/shared.module';
import { GuestModalComponent } from './employee-page/components/guest-modal/guest-modal.component';
import { EmployeePage } from './employee-page/employee.page';
import { EmployeePageRoutingModule } from './employee-routing.module';




@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    EmployeePageRoutingModule,
    ReactiveFormsModule,
    SharedModule
  ],
  declarations: [EmployeePage, GuestModalComponent]
})
export class EmployeePageModule {}
