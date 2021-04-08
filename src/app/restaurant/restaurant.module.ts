import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { RestaurantPageRoutingModule } from './restaurant-routing.module';

import { RestaurantPage } from './restaurant.page';
import { SharedModule } from '../shared/shared.module';
import { UsualDishesComponent } from './usual-dishes/usual-dishes.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SharedModule,
    RestaurantPageRoutingModule
  ],
  declarations: [RestaurantPage, UsualDishesComponent]
})
export class RestaurantPageModule {}
