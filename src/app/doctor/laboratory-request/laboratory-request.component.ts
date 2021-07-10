import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {Observable, Subscription} from 'rxjs';
import {map, startWith} from 'rxjs/operators';
import { LabReqService} from './../../services/labratoryRequest/lab-req.service'
import {Customer} from '../../core/store/customer';
import {CustomersService} from '../../core/store/customers.service';
import {Router} from '@angular/router';
import {SalamatserviceService} from '../../services/salamatservice.service';
import {ApiconfigserviceService} from '../../service/apiconfigservice.service';
import {ProfileseviceService} from '../../services/profilesevice.service';
import {Web_API_Service_Requset_Items} from '../../classes/web_API_Service_Requset_Items'



export class Country {
  constructor(public name: string, public code: string) {}
}
@Component({
  selector: 'app-laboratory-request',
  templateUrl: './laboratory-request.component.html',
  styleUrls: ['./laboratory-request.component.scss']
})

export class LaboratoryRequestComponent implements OnInit {
    loinC_Code = new Array()
    SendData = new Array()
    expiryDate = '';
    dateObject1 = ''
     mess: any;
    printValid = false
     favdrug: any;
     favtemplist: Array<any> = [];
     serchresult: any;
     status: any;
     data_get: any;
     data: any;
    @ViewChild('input', { static: false })
    set input(element: ElementRef<HTMLInputElement>) {
        if (element) {
            element.nativeElement.focus()
        }
    }
  labform: FormGroup;
  customers: any;
  stateHistory = null;
  isHistoryVisible = false;
  subs = new Subscription();
  testName = '';
  myControl = new FormControl();
  serchlist = new Array();
  listdrug: any[];
  name: any = [];
  value = '';
  messg: any;
  show: boolean;
  datafinal:  Array<any> = [];
  listserves: [];
  historylab: any;
  testnameList = '';
  result: any;
  result1: any;
   detail: any;
   loading: boolean;
   url: any;

  private customerobj: any;
  private labfav:  Array<any> = [];
    messgshow: any;
    messag: any;
  constructor(
      private modalService: NgbModal,
      private _labReq: LabReqService,
      private customersService: CustomersService,
      private router: Router,
      private fb: FormBuilder,
      private  _salamatservice: SalamatserviceService,
      private  i: ApiconfigserviceService,
      private _ser: ProfileseviceService


  ) {
      this._labReq.seturl(this.i.config.API_URL);
      this._ser.seturl(this.i.config.API_URL);
      this.url = this.i.config.API_URL;
      this.loading = false;
    if (localStorage.getItem('token') == null) {
      this.router.navigate(['/pages/login']);
    }
}
  GetDetails(content) {

    this.modalService.open(content, { size: 'sm' }).result.then((result) => {
    }, (reason) => {
    });
    this._labReq.getlabfav().subscribe(p => {
      this.result1 = p['items'];
      this.labfav = [];
      this.result1.forEach(e => {
        const content1 = {
          'id': e['id'],
          'res' : JSON.parse(e['jsonValue'])
        };
        this.labfav.push(content1);
      })
    });
  }
  obshow() {
    this.show = true;
  }
  obhide() {
    this.show = false;
  }
    postDatestartdate(event: any) {
        this.expiryDate = event;
        console.log(this.expiryDate)
    }
    ngOnInit() {

     // this.getlist_lab();
     this._ser.gae_fav(1).subscribe( h => {
         this.favdrug = h['items'];
         console.log(h);
     })
     document.getElementById('test').focus();

     this.labform = this.fb.group({
      'labname': ['', Validators.required ],
         'date': ['']
    })
    this._labReq.getlistitem('1').subscribe(res => {
      this.listdrug = res;


    });
    this.serchlist = null;
    this.show = false;
    //  this._labReq.servicename().subscribe(res => {
    //   this.listserves = res;
    //
    //     }
    // );
   this.subs.add(this.customersService.stateChanged.subscribe(state => {
      if (state) {
        this.customers = JSON.stringify(state.customer['res']);
        this.customerobj = JSON.parse(this.customers);
      }
    }));
      // this._labReq.Get_Laboratory_Order_Encounter(this.customerobj['currentEncounterLocationID']).subscribe( p => {
      //     this.data_get = p;
      //     console.log(p)
      //     this.data_get['items'].forEach( u => {
      //         this.status = u['statusIS'];
      //         const  y = JSON.parse(u['jsonValue']);
      //         console.log(y);
      //         y.forEach( h => {
      //             this.datafinal.push(h);
      //             console.log('dataFinal', this.datafinal)
      //         })
      //     })
      // });
  }

  onSearchChange(event: any) {
    const key = event.target.value;
    this.name = key;
    this.serchlist = [];
    this.listdrug['items'].forEach(item => {
      if (key === '') {
        this.serchlist = [];
      }
      if (key != '' ) {
        const f = item.displayName ? item.displayName.toLowerCase().indexOf(key) : '';
        // alert(f);
          // tslint:disable-next-line:triple-equals
        if (f != -1) {
          this.serchlist.push(item)

        } else {

            const f = item.masterService_NationalCode ? item.masterService_NationalCode.toLowerCase().substring(0, key.length) : '';

            if (key === f) {

                this.serchlist.push(item)
            }
        }
      }
    });
  }

  set(d: any) {


      console.log('d', d['loinC_Code']);
      this.loinC_Code.push(d['loinC_Code']);
      for (const i of this.loinC_Code) {
          const OBJ = new Web_API_Service_Requset_Items;
          OBJ.qty = '1',
              OBJ.service_Terminology_ID = '13',
              OBJ.service_Code = i
          this.SendData.push(OBJ)
          console.log(this.SendData)
      }

      const  data = {
          'masterServiceID': d['masterServiceID'],
          'orderTemplateID': d['orderTemplateID'],
          'qty': '1',
          'priorityIX': '0',
          'name': d['name'],
          'national_code' : d['masterService_NationalCode'],
          'displayName' : d['displayName'],


      };
      this.add_item_to_list(data);


  }
  save() {
    if (this.datafinal.length > 0) {
      this.loading = true;
        this._labReq.insertlab(this.datafinal, this.expiryDate, this.SendData).subscribe(p => {
          console.log('newwwww test', p)
        this.result = p;
          this.loading = false;
        if (p['success'] == true) {
            this.printValid=true;
            this.datafinal = [];
            this.value = '';
            this.printValid = true;
        } else {

        }
      });
    } else {
      this.show_messeg('هیچ خدمتی برای ارسال انتخاب نشده است' , true);
    }

  }
Get_Last_History_Of_Observation(name: any) {
  this.detail = JSON.parse(localStorage.getItem('detailenconter'));
  this.datafinal.forEach(p => {
      if (p['name'] === name) {
        this._labReq.gethistorylab(this.customerobj['patientID'], p['masterServiceID']).subscribe(res => {
          this.historylab = res;
        })
      }
    })
}
  change(event: any ) {
    alert(event)
    this._labReq.getlistitem('0').subscribe(res => {
      this.listdrug = res;
      console.log(res)
    });

  }
  onSubmit() {

  }
  deleteItem(i) {
    this.datafinal.splice(i, 1)
  }

  favLIst(i: any) {
    this._labReq.favariteList(i).subscribe(res => {
        this.show_messeg('آزمایش به لیست پرکاربرد اضافه شد' , true);
    })
  }

 async deletmozmen(id: any) {
 await this._labReq.deletfavlab(id).subscribe(p => {
    this._labReq.getlabfav().subscribe(p => {
      this.result1 = p['items'];
      this.labfav = [];
      this.result1.forEach(e => {
        const content1 = {
          'id': e['id'],
          'res' : JSON.parse(e['jsonValue'])
        };
        this.labfav.push(content1);
      })
    });
  })
  }

  setfav(i: any) {
      const chek = false;
      if (this.datafinal.length > 0) {
           this.datafinal.forEach( p => {
             this.add_item_to_list(i);
           })
      } else {
          this.datafinal.push(i);
      }

  }

    setdrug(item: any, event: any) {

        const  h = JSON.parse(item);
         h.forEach( p => {
            this.add_item_to_list(p);
         })


    }



    saveedit() {

        const data = {
            'id': this.data_get['items'][0]['id'],
            'encounterLocationID': this.data_get['items'][0]['encounterLocationID'],
            'codeOf': '',
            'priorityIX': '',
            'statusIS': '',
            'description': '',
            'orderSheetGroup': '',
            'jsonValue': JSON.stringify(this.datafinal),
            'orderevents': this.datafinal
        }
        this._labReq.Update_Laboratory_Order(data).subscribe( p => {
            this.datafinal = [];
            this.data_get = [];
            this._labReq.Get_Laboratory_Order_Encounter(this.customerobj['currentEncounterLocationID']).subscribe( p => {
                this.data_get = p;
                this.show_messeg('بروزرسانی داده با موفقیت انجام شد', true)
                this.datafinal = [];
                this.data_get['items'].forEach( u => {
                    this.status = u['statusIS'];
                    const  y = JSON.parse(u['jsonValue']);
                    y.forEach( h => {
                        this.datafinal.push(h);
                    })
                })
            });
        });
    }

    show_messeg(mess: any, sh: boolean) {
        this.messgshow = sh;
        this.messag = mess;
    }
    closem() {
        this.messgshow = false;
        document.getElementById('test').focus();
    }
    add_item_to_list(item: any) {
      console.log('iteeeeeeeeeeeeeeeeeem', item)
        this._salamatservice.getdetailtest(localStorage.getItem('salamattoken'), localStorage.getItem('salamatusertoken'), localStorage.getItem('citizentoken'), localStorage.getItem('samadcode'), item['national_code']).subscribe(p => {
            this.messg = p['resMessage'];
        });
        //const persons =  this.datafinal.find(x => x.displayName == item['displayName']);
        // tslint:disable-next-line:triple-equals
        if (1<2) {
            this.datafinal.push(item);
            console.log(this.datafinal)
            this.serchlist = null;
            this.serchresult = [];
            this.labform.reset();
            document.getElementById('test').focus();
        } else {
            this.show_messeg('آزمایش تکراری یافت شد' , true);
            this.serchlist = null;
            this.serchresult = [];
            this.labform.reset();
            document.getElementById('test').focus();
        }
    }
    // listlabratory
    getlist_lab() {
       this._labReq.getlab_byenconter().subscribe( p => {

           if (p['success']) {

               p['items'].forEach( u => {
                 if (u['rayavaran_Loinc_Class_Code'] == '1') {
                     u.web_API_Service_Requset_Item_Views.forEach( h => {
                        const content =  { 'qty': '1', 'priorityIX': '0', 'displayName': h['service_DisplayName'] }
                        this.datafinal.push(content);
                         this.data = h;
                     })


                 }
                   console.log('dddd', u)
               })
           }
       })
    }
}
