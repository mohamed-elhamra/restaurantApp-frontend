import { Customer } from './../../models/customer';
import { CustomerService } from './../../services/customer.service';
import { OrderItemComponent } from './../order-item/order-item.component';
import { OrderItem } from './../../models/order-item';
import { Order } from './../../models/order';
import { OrderService } from './../../services/order.service';
import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { Router, ActivatedRoute } from '@angular/router';
import Swal from 'sweetalert2/dist/sweetalert2.js';

@Component({
  selector: 'app-order',
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.css']
})
export class OrderComponent implements OnInit {

  customerList: Customer[] = [];
  isValid: boolean = true;

  constructor(
    private service: OrderService,
    private dialog: MatDialog,
    private customerService: CustomerService,
    private toastr: ToastrService,
    private router: Router,
    private currentRoute: ActivatedRoute
    ) { }

  ngOnInit(): void {
    this.resetForm();
    this.customerService.getCustomerList().then(res => this.customerList = res as Customer[]);
  }

  get formData(): Order {
    return this.service.formData;
  }

  get orderItem(): OrderItem[] {
    return this.service.orderItem;
  }

  resetForm(form?: NgForm) {
    if (form = null)
      form.resetForm();
    this.service.formData = {
      id: 0,
      orderNo: Math.floor(100000 + Math.random() * 900000).toString(),
      customerId: 0,
      method: '',
      total: 0
    };
    this.service.orderItem = []
  }

  addOrEditOrderItem(orderItemIndex,orderId){
    const dialogConfig = new MatDialogConfig();
    dialogConfig.autoFocus = true;
    dialogConfig.disableClose = true;
    dialogConfig.width = "50%";
    dialogConfig.data = { orderItemIndex, orderId };
    this.dialog.open(OrderItemComponent, dialogConfig).afterClosed().subscribe(res => {
      this.updateGrandTotal();
    });
  }

  onDeleteOrderItem(orderId: number,index: number){  
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
      if (result.value) {
        this.service.orderItem.splice(index,1);
        this.updateGrandTotal();
        Swal.fire(
          'Deleted!',
          'Your item has been deleted.',
          'success'
        )
      }
    }) 
  }

  updateGrandTotal(){
    this.service.formData.total = this.service.orderItem.reduce((prev,curr) => {
      return prev + curr.total;
    },0);
    this.service.formData.total = parseFloat(this.service.formData.total.toFixed(2));
  }

  validateForm(){
    this.isValid = true;
    if(this.service.formData.customerId==0 || this.service.orderItem.length == 0 || this.service.formData.method==''){
      this.isValid = false;
    }else{
      this.isValid = true;
    }
    return this.isValid;
  }

  onSubmit(form:NgForm){
    if(this.validateForm()){
      this.service.saveOrUpdateOrder().subscribe(res => {
        this.resetForm();
        this.toastr.success('Submitted successfully', 'Restaurant App.');
        this.router.navigate(['/orders']);
      });
    }
  }

}
