import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FormCheckGuard } from '@shared/guards/form-check.guard';
import { RecurrentDishesPage } from './recurrent-dishes-page/recurrent-dishes.page';
import { RestaurantPage } from './restaurant-page/restaurant.page';
import { SettingsPage } from './settings-page/settings.page';


const routes: Routes = [
  {
    path: '',
    component: RestaurantPage
  },
  {
    path: 'recurrent-dishes/:dish',
    component: RecurrentDishesPage,
    canDeactivate: [FormCheckGuard]
  },
  {
    path: 'settings',
    component: SettingsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RestaurantPageRoutingModule {}
