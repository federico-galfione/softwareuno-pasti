import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { SharedModule } from '../shared/shared.module';
import { InfoModalComponent } from './recurrent-dishes-page/components/info-modal/info-modal.component';
import { RecurrentDishesPage } from './recurrent-dishes-page/recurrent-dishes.page';
import { RestaurantPage } from './restaurant-page/restaurant.page';
import { RestaurantPageRoutingModule } from './restaurant-routing.module';
import { SettingsPage } from './settings-page/settings.page';



@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SharedModule,
    RestaurantPageRoutingModule
  ],
  declarations: [RestaurantPage, RecurrentDishesPage, SettingsPage, InfoModalComponent]
})
export class RestaurantPageModule {}
