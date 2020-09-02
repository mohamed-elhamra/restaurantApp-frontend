import { OrderService } from './../../services/order.service';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.css']
})
export class OrdersComponent implements OnInit {

  orderList;

  constructor(
    private orderService: OrderService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.orderService.getOrderList().then(res => this.orderList = res);
  }

  openForEdit(orderId: number){
    this.router.navigate(['/order/edit/' + orderId]);
  }

}
