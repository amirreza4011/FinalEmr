import { Component, OnInit } from '@angular/core';
import {EmrdrugserviceService} from '../../services/emr/emrdrugservice.service';
import {CustomersService} from '../../core/store/customers.service';
import {Customer} from '../../core/store/customer';
import {Subscription} from 'rxjs';
import {ApiconfigserviceService} from '../../service/apiconfigservice.service';
import {Sort} from '@angular/material/sort';


@Component({
  selector: 'app-historynos',
  templateUrl: './historynos.component.html',
  styleUrls: ['./historynos.component.css']
})
export class HistorynosComponent implements OnInit {
  listhistory: any;
  customers: string;
  subs = new Subscription();
  customerobj: any[];
  listhistoryitem: any[];
  sortedData: any[];
  disableThirdHeader = false;
  constructor(private  _service: EmrdrugserviceService,
              private customersService: CustomersService,
              private  i: ApiconfigserviceService

  ) {        this._service.seturl(this.i.config.API_URL);
  }
  ngOnInit(): void {


    this.subs.add(this.customersService.stateChanged.subscribe(state => {
      if (state) {
        this.customers = JSON.stringify(state.customer['res']);
        this.customerobj = JSON.parse(this.customers);
      }
    }));
    this._service.getgrughistory(this.customerobj['patientID']).subscribe( p => {
      this.listhistory = p;
      this.sortedData = this.listhistory;
      console.log('history1:',this.sortedData);
    })
  }
  //  OrderFunc() {
  //   // Get the list
  //   const ul = document.getElementById("table");
  //   // Get its items as an array
  //   const lis = [ul.querySelectorAll("li")];
  //   // Sort the array with localeCompare
  //   lis.sort((a, b) => a.textContent.localeCompare(b.practitioner_FirstName));
  //   // Move each of them to the end of the list; this
  //   // puts them back in order
  //   for (const li of lis) {
  //     ul.appendChild(li);
  //   }
  // }

  detail(id: any) {
   this._service.getdetail(id).subscribe( p => {
     this.listhistoryitem = p;
   })
  }
  // sortedData = this.listhistory.slice();

  sortData(sort: Sort) {

    const data = this.listhistory.slice();
    if (!sort.active || sort.direction === '') {
      this.sortedData = data;
    } else {
      this.sortedData = data.sort((a, b) => {
        const aValue = (a as any)[sort.active];
        const bValue = (b as any)[sort.active];
        return (aValue < bValue ? -1 : 1) * (sort.direction === 'asc' ? 1 : -1);
      });
    }
  }

}
