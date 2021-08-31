import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { SharedModule } from '../shared/shared.module';
import { OrdersPage } from './orders-page/orders.page';
import { InfoModalComponent } from './recurrent-dishes-page/components/info-modal/info-modal.component';
import { RecurrentDishesPage } from './recurrent-dishes-page/recurrent-dishes.page';
import { AddMenuWarnComponent } from './restaurant-page/components/add-menu-warn/add-menu-warn.component';
import { RestaurantPage } from './restaurant-page/restaurant.page';
import { RestaurantPageRoutingModule } from './restaurant-routing.module';
import { SettingsPage } from './settings-page/settings.page';



@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    SharedModule,
    RestaurantPageRoutingModule
  ],
  declarations: [RestaurantPage, RecurrentDishesPage, SettingsPage, InfoModalComponent, AddMenuWarnComponent, OrdersPage]
})
export class RestaurantPageModule {}
