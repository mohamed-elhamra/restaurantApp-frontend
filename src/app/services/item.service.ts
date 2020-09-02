import { environment } from './../../environments/environment';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ItemService {

  constructor(private http: HttpClient) { }

  getItemList(){
    return this.http.get(`${environment.apiURL}/items`).toPromise();
  }

}
