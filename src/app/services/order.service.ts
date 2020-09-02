import { environment } from './../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Order } from './../models/order';
import { Injectable } from '@angular/core';
import { NgForm } from '@angular/forms';
import { OrderItem } from '../models/order-item';

@Injectable({
  providedIn: 'root'
})
export class OrderService {

  formData: Order;
  orderItem: OrderItem[] = [];

  constructor(private http: HttpClient) { }

  saveOrUpdateOrder(){
    var order = {
      ...this.formData,
      orderItem: this.orderItem
    };
    
    return this.http.post(`${environment.apiURL}orders`, order);
  }

  getOrderList(){
    return this.http.get(`${environment.apiURL}orders`).toPromise();
  }

}
