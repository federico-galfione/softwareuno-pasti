import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { RecurrentDishesPage } from './recurrent-dishes/recurrent-dishes.page';

import { RestaurantPage } from './restaurant-page/restaurant.page';

const routes: Routes = [
  {
    path: '',
    component: RestaurantPage
  },
  {
    path: 'recurrent-dishes/:dish',
    component: RecurrentDishesPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RestaurantPageRoutingModule {}
