import { Component } from '@angular/core';
import { Router } from "@angular/router";
import { RestAndTakeawayOrders } from "@shared/models";
import { MediaService } from '@shared/services';
import { RestaurantService } from '../restaurant.service';

@Component({
  selector: 'app-orders',
  templateUrl: './orders.page.html',
  styleUrls: ['./orders.page.scss']
})
export class OrdersPage {

  orders: RestAndTakeawayOrders;

  public orderingFn = (a, b) => {
    const order = {
      'primi': 1,
      'secondi': 2,
      'contorni': 3,
      'pizze': 4
    }
    return order[a.key] < order[b.key] ? -1 : 0
  }


  constructor(public mediaSvc: MediaService, private restaurantSvc: RestaurantService, private router: Router) { 
    this.restaurantSvc.getOrders().subscribe(orders => {
      this.orders = orders
    })
  }

  goToMenu(){
    this.router.navigate(['restaurant'])
  }
}
