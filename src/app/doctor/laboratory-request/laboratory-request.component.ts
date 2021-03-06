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
import {HospitalService} from '../../services/hospital/hospital.service';
import {isObservable} from 'rxjs/internal-compatibility';
import {HttpClient} from '@angular/common/http';



export class Country {
  constructor(public name: string, public code: string) {}
}
@Component({
  selector: 'app-laboratory-request',
  templateUrl: './laboratory-request.component.html',
  styleUrls: ['./laboratory-request.component.scss']
})

export class LaboratoryRequestComponent implements OnInit {
    printOK = false
    loinC_Code = new Array()
    SendData = new Array()
    expiryDate = '';
    dateObject1 = ''
    persianNumbers = [/۰/g, /۱/g, /۲/g, /۳/g, /۴/g, /۵/g, /۶/g, /۷/g, /۸/g, /۹/g]
    arabicNumbers  = [/٠/g, /١/g, /٢/g, /٣/g, /٤/g, /٥/g, /٦/g, /٧/g, /٨/g, /٩/g]
    day = new Date();
    Date1: Date
    today = new Date().toLocaleDateString('fa-IR')
     mess: any;
    printValid = false
     favdrug: any;
     favtemplist: Array<any> = [];
     serchresult: any;
     status: any;
     data_get: any;
     data: any;
  labform: FormGroup;
  customers: any;
  stateHistory = null;
  isHistoryVisible = false;
  subs = new Subscription();
  testName = '';
  myControl = new FormControl();
  serchlist = new Array();
  listdrug = new Array();
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
    d: any
    hospital = ''

   customerobj: any;
   labfav:  Array<any> = [];
    messgshow: any;
    messag: any;
     temp: any;
     idm: any;
     list_lab_master = new Array();
     reslab: any;
     laball: any;
  constructor(
      private modalService: NgbModal,
      private _labReq: LabReqService,
      private customersService: CustomersService,
      private router: Router,
      private fb: FormBuilder,
      private  _salamatservice: SalamatserviceService,
      private  i: ApiconfigserviceService,
      private _ser: ProfileseviceService,
      private _serviceh: HospitalService,
      private  http: HttpClient


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
        this.laball=p;
      this.result1 = p['items'];
      this.labfav = [];
      this.result1.forEach(e => {
          const  g= JSON.parse(e['jsonValue']);
          if(this.i.config.lab_type=='M'){
              this.list_lab_master['item'].forEach( b =>{
                  if(g['displayName']==b['displayName']){
                      const content1 = {
                          'id': e['id'],
                          'res' : JSON.parse(e['jsonValue'])
                      };
                      this.labfav.push(content1);
                  }
              })
          }else {
              this.listdrug['items'].forEach( b =>{
                  if(g['displayName']==b['displayName']){
                      const content1 = {
                          'id': e['id'],
                          'res' : JSON.parse(e['jsonValue'])
                      };
                      this.labfav.push(content1);
                  }
              })
          }


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
    fixNumbers = function (str: any) {
        if (typeof str === 'string') {
            for ( let i = 0; i < 10; i++) {
                str = str.replace(this.persianNumbers[i], i).replace(this.arabicNumbers[i], i);
            }
        }
        return str;
    };
    ngOnInit() {

        this.list_lab_master = null;
        this.listdrug = null;
       this.get_list_lab();

       this._serviceh.getAll().subscribe(res => {
           this.hospital = res.hospitalName
       });
      this.Date1 = new Date();
      this.Date1.setDate(this.Date1.getDate() + 30);

       this.d = this.Date1.toLocaleDateString('fa-IR')
       this.d = this.fixNumbers(this.d)
       const dash = '-';
       this.d = this.d.replace(/\//g, dash)
        this.expiryDate = this.d;
       this.dateObject1 = this.d;



     this._ser.gae_fav(1).subscribe( h => {
         this.favdrug = h['items'];
         console.log('fav list:', h);
     })


     this.labform = this.fb.group({
      'labname': ['', Validators.required ],
         'date': ['']
    })

    this.serchlist = null;
    this.show = false;
   this.subs.add(this.customersService.stateChanged.subscribe(state => {
      if (state) {
        this.customers = JSON.stringify(state.customer['res']);
        this.customerobj = JSON.parse(this.customers);
      }
    }));

  }
  get_list_lab() {
        if (this.i.config.lab_type == 'L') {
              this._labReq.getlistitem('1').subscribe((res) => {
                  this.list_lab_master = null;
                this.listdrug = res;
                  this.getlist_lab();
            });
        } else {
            this._labReq.get_list_lab_bymaster().subscribe( result => {
                this.listdrug = null;
                this.list_lab_master = result;
                this.getlist_lab();
            })
        }
  }
 async onSearchChange(event: any) {

    const key = event.target.value;
    this.name = key;
    this.serchlist = [];
    if (this.listdrug) {
        await   this.listdrug['items'].forEach(item => {
            if (key === '') {
                this.serchlist = [];
            }
            if (key != '') {
                const f = item.displayName ? item.displayName.toLowerCase().substring(0, key.length) : '';
                // alert(f);
                // tslint:disable-next-line:triple-equals
                if (key === f) {
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
     if (this.list_lab_master) {
         await   this.list_lab_master['item'].forEach(item => {
             if (key === '') {
                 this.serchlist = [];
             }
             if (key != '') {
                 const f = item.displayName ? item.displayName.toLowerCase().substring(0, key.length) : '';
                 // alert(f);
                 // tslint:disable-next-line:triple-equals
                 if (key === f) {
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
  }

  set(d: any) {
     this.printOK = true
      console.log(d);
      const  data = {
          'masterServiceID': d['masterServiceID'],
          'orderTemplateID': d['orderTemplateID'],
          'qty': '1',
          'priorityIX': '0',
          'name': d['name'],
          'national_code' : d['masterService_NationalCode'],
          'displayName' : d['displayName'],
          'loinc_code': d['loinC_Code']
      };
      this.add_item_to_list(data);
  }
  save() {
    if (this.datafinal.length > 0) {
      this.loading = true;
        this._labReq.insertlab(this.datafinal, this.dateObject1, this.SendData).subscribe(p => {
        this.result = p;
          this.loading = false;
        if (p['success'] == true) {
            this.getlist_lab();
            this.printValid = true;
            this.datafinal = [];
            this.value = '';
            this.SendData = [];
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
          const  g= JSON.parse(e['jsonValue']);
          if(this.i.config.lab_type=='M'){
              this.list_lab_master['item'].forEach( b =>{
                  if(g['displayName']==b['displayName']){
                      const content1 = {
                          'id': e['id'],
                          'res' : JSON.parse(e['jsonValue'])
                      };
                      this.labfav.push(content1);
                  }
              })
          }else {
              this.listdrug['items'].forEach( b =>{
                  if(g['displayName']==b['displayName']){
                      const content1 = {
                          'id': e['id'],
                          'res' : JSON.parse(e['jsonValue'])
                      };
                      this.labfav.push(content1);
                  }
              })
          }
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
      this.printOK = true
        const  h = JSON.parse(item);
        console.log('h:', h)
         h.forEach( d => {
             if (this.i.config.lab_type == 'M'){
                 const  data = {
                     'masterServiceID': d['masterServiceID'],
                     'orderTemplateID': d['orderTemplateID'],
                     'qty': '1',
                     'priorityIX': '0',
                     'name': d['name'],
                     'national_code' : d['masterService_NationalCode'],
                     'displayName' : d['name'],
                     'loinc_code': d['masterServiceID']
                 };
                 this.add_item_to_list(data);
             } else {
                 const  data = {
                     'masterServiceID': d['masterServiceID'],
                     'orderTemplateID': d['orderTemplateID'],
                     'qty': '1',
                     'priorityIX': '0',
                     'name': d['name'],
                     'national_code' : d['masterService_NationalCode'],
                     'displayName' : d['name'],
                     'loinc_code': d['masterServiceID']
                 };
                 this.add_item_to_list(data);
             }
         })
    }

    saveedit() {

        const data = {
            'id': this.idm,
            'rayavaran_Loinc_Class_Code': '1',
            'jsonValue': JSON.stringify(this.datafinal),
            'practitionerID': '',
            'encounterID': localStorage.getItem('encounterID'),
            'requestDate': '',
            'expiryDate': this.dateObject1,
            'rayavaran_ServiceRequest_Status': '1',
            'web_API_Service_Requset_Items': this.SendData

        }

        this._labReq.Update_Laboratory_Order(data).subscribe( p => {
            this.result = p;
            this.datafinal = [];
            this.data_get = [];
            if (p['success'] == true) {
                this.get_list_lab()
                this.printValid = true;
                this.datafinal = [];
                this.value = '';
                this.SendData = [];
                this.printValid = true;
            } else {

            }
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
        this._salamatservice.getdetailtest(localStorage.getItem('salamattoken'), localStorage.getItem('salamatusertoken'), localStorage.getItem('citizentoken'), localStorage.getItem('samadcode'), item['national_code']).subscribe(p => {
            this.messg = p['resMessage'];
        });
         const persons =  this.datafinal.find(x => x.displayName == item['displayName']);
        // tslint:disable-next-line:triple-equals
        if (!persons) {
            if (this.i.config.lab_type == 'L') {
                const OBJ = new Web_API_Service_Requset_Items;
                    OBJ.qty = '1',
                    OBJ.service_Terminology_ID = '13',
                    OBJ.service_Code = item['loinc_code']
                this.SendData.push(OBJ)
            } else {
                const OBJ = new Web_API_Service_Requset_Items;
                OBJ.qty = '1',
                    OBJ.service_Terminology_ID = '14',
                    OBJ.service_Code = item['masterServiceID']
                this.SendData.push(OBJ)
            }

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
    getlist_lab() {

       this._labReq.getlab_byenconter().subscribe( p => {

           this.reslab = p;
           let g = p;
           this.temp = p;
           if (p['success']) {
              g = p['items'];
              if (g.length > 0) {
                  g.forEach( u => {

                      this.idm = u['id'];
                      if (u['rayavaran_Loinc_Class_Code'] == '1') {
                          this.status = u['rayavaran_ServiceRequest_Status'];
                          u.web_API_Service_Requset_Item_Views.forEach( h => {
                               console.log('h is:', h)
                              const content =  { 'qty': '1', 'priorityIX': '0', 'displayName': h['service_DisplayName'], 'service_Terminology_ID': h['service_Terminology_ID'], 'service_Code': h['service_Code']}
                              this.datafinal.push(content);
                              this.data = content;
                          })
                          if(this.datafinal){
                              this.datafinal.forEach( k => {
                                  console.log('k:',k)
                                  if (this.i.config.lab_type == 'L') {
                                      const OBJ = new Web_API_Service_Requset_Items;
                                      OBJ.qty = '1',
                                          OBJ.service_Terminology_ID = '13',
                                          OBJ.service_Code = k['service_Code']
                                      this.SendData.push(OBJ)
                                  } else {
                                      const OBJ = new Web_API_Service_Requset_Items;
                                      OBJ.qty = '1',
                                          OBJ.service_Terminology_ID = '14',
                                          OBJ.service_Code = k['service_Code']
                                      this.SendData.push(OBJ)
                                  }
                              })
                          }
                      }
                  })
              }

           }
       })
    }
}
