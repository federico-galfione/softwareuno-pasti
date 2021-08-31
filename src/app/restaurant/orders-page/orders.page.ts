import { Component } from '@angular/core';
import { Order } from '@shared/models/Order';
import { MediaService } from '@shared/services';
import { RestaurantService } from '../restaurant.service';

@Component({
  selector: 'app-orders',
  templateUrl: './orders.page.html',
  styleUrls: ['./orders.page.scss']
})
export class OrdersPage {

  orders: Order[];

  constructor(public mediaSvc: MediaService, private restaurantSvc: RestaurantService) { 
    this.restaurantSvc.getOrders().subscribe(orders => { 
      this.orders = orders 
      console.log(this.orders)
    })
  }

}
