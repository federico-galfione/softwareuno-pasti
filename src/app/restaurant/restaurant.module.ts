import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { RestaurantPageRoutingModule } from './restaurant-routing.module';

import { RestaurantPage } from './restaurant-page/restaurant.page';
import { SharedModule } from '../shared/shared.module';
import { RecurrentDishesPage } from './recurrent-dishes/recurrent-dishes.page';
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SharedModule,
    RestaurantPageRoutingModule
  ],
  declarations: [RestaurantPage, RecurrentDishesPage]
})
export class RestaurantPageModule {}
