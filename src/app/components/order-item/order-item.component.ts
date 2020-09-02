import { OrderItem } from 'src/app/models/order-item';
import { OrderService } from './../../services/order.service';
import { NgForm } from '@angular/forms';
import { ItemService } from './../../services/item.service';
import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Item } from 'src/app/models/item';

@Component({
  selector: 'app-order-item',
  templateUrl: './order-item.component.html',
  styleUrls: ['./order-item.component.css']
})
export class OrderItemComponent implements OnInit {

  formData: OrderItem;
  itemList: Item[];
  isValid: boolean = true;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data,
    public dialogRef: MatDialogRef<OrderItemComponent>,
    private itemService: ItemService,
    private orderService: OrderService
  ) { }

  ngOnInit(): void {

    this.itemService.getItemList().then(res => this.itemList = res as Item[]);

    if(this.data.orderItemIndex==null){
      this.formData = {
        id: 0,
        orderId: this.data.orderId,
        itemId: 0,
        quantity: 0,
        itemName: '',
        price: 0,
        total: 0
      }
    }else{
        this.formData = this.orderService.orderItem[this.data.orderItemIndex];
    }
  }
  

  updatePrice(ctrl){
    if(ctrl.selectedIndex==0){
      this.formData.price=0;
      this.formData.itemName='';
    }else{
      this.formData.price=this.itemList[ctrl.selectedIndex-1].price;
      this.formData.itemName=this.itemList[ctrl.selectedIndex-1].name;
    }
    this.updateTotal();
  }

  updateTotal(){
    this.formData.total = parseFloat((this.formData.quantity * this.formData.price).toFixed(2));
  }

  onSubmit(form:NgForm){
    if(this.validateForm(form.value)){
      if(this.data.orderItemIndex==null){
        this.orderService.orderItem.push(form.value);
      }else{
        this.orderService.orderItem[this.data.orderItemIndex]=form.value;
      }
      this.dialogRef.close();
    }
  }

  validateForm(formData:OrderItem){
    this.isValid = true;
    if(formData.itemId==0 || formData.quantity==0){
      this.isValid = false;
    }
    return this.isValid;
  }

}
