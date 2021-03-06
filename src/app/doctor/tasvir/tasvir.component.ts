import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {Subscription} from 'rxjs';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {LabReqService} from '../../services/labratoryRequest/lab-req.service';
import {CustomersService} from '../../core/store/customers.service';
import {Router} from '@angular/router';
import {SalamatserviceService} from '../../services/salamatservice.service';
import {ApiconfigserviceService} from '../../service/apiconfigservice.service';
import {Web_API_Service_Requset_Items} from '../../classes/web_API_Service_Requset_Items';
import {HospitalService} from '../../services/hospital/hospital.service';
import {compose} from '@ngxs/store/operators';

@Component({
  selector: 'app-tasvir',
  templateUrl: './tasvir.component.html',
  styleUrls: ['./tasvir.component.css']
})
export class TasvirComponent implements OnInit {
  printOK = false
   mess: any;
  data_get: any;
  status: any
   status_ta: string;
   idm: any;
  messgshow: any;
   data: { priorityIX: string; displayName: any; qty: string };

  persianNumbers = [/۰/g, /۱/g, /۲/g, /۳/g, /۴/g, /۵/g, /۶/g, /۷/g, /۸/g, /۹/g]
  arabicNumbers  = [/٠/g, /١/g, /٢/g, /٣/g, /٤/g, /٥/g, /٦/g, /٧/g, /٨/g, /٩/g]
  Date1: Date
  d: any
  SendData = new Array()
  loinC_Code = new Array()
  labform: FormGroup;
  expiryDate = ''
  dateObject1 = ''
  printValid = false
  customers: any;
  stateHistory = null;
  isHistoryVisible = false;
  subs = new Subscription();
  testName = '';
  myControl = new FormControl();
  serchlist = new Array();
  serchlistloink = new Array();

  listdrug: any[];
  name: any = [];
  value = '';
  show: boolean;
  datafinal:  Array<any> = [];
  listserves: [];
  messag: any;
  historylab: any;
  testnameList = '';
  result: any;
  messg: any;
  result1: any;
  detail: any;
  loading: boolean;
  hospital = ''
   customerobj: any;
  private labfav:  Array<any> = [];
   count = 0;
  constructor(
      private modalService: NgbModal,
      private _labReq: LabReqService,
      private customersService: CustomersService,
      private router: Router,
      private fb: FormBuilder,
      private  _salamatservice: SalamatserviceService,
      private  i: ApiconfigserviceService,
      private _serviceh: HospitalService,


  ) {
    this._labReq.seturl(this.i.config.API_URL)
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
        const  g = JSON.parse(e['jsonValue']);
          this.listdrug['items'].forEach( b => {
            if (g['displayName'] == b['displayName']) {
              const content1 = {
                'id': e['id'],
                'res' : JSON.parse(e['jsonValue'])
              };
              this.labfav.push(content1);
            }
          })

      })
    });
  }
  obshow() {
    this.show = true;
  }
  obhide() {
    this.show = false;
  }
  fixNumbers = function (str: any) {
    if (typeof str === 'string') {
      for ( let i = 0; i < 10; i++) {
        str = str.replace(this.persianNumbers[i], i).replace(this.arabicNumbers[i], i);
      }
    }
    return str;
  };

  async ngOnInit() {
    this._labReq.getlistitem('2').subscribe(res => {
      this.listdrug = res;
      this.getlist_lab();

    });
    this._serviceh.getAll().subscribe(res => {
      this.hospital = res.hospitalName
    });
    this.status_ta = '2.1';
    this.Date1 = new Date();
    this.Date1.setDate(this.Date1.getDate() + 30);

    this.d = this.Date1.toLocaleDateString('fa-IR')
    this.d = this.fixNumbers(this.d)
    const dash = '-';
    this.d = this.d.replace(/\//g, dash)
    this.expiryDate = this.d;
    this.dateObject1 = this.d;
    this.labform = this.fb.group({
      'labname': ['', Validators.required ],
    })

    this.serchlist = null;
    this.show = false;
    // this._labReq.servicename().subscribe(res => {
    //       this.listserves = res;
    //       console.log(res);
    //     }
    // );
    this.subs.add(this.customersService.stateChanged.subscribe(state => {
      if (state) {
        this.customers = JSON.stringify(state.customer['res']);
        this.customerobj = JSON.parse(this.customers);
      }
    }));
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
        const f =  item.displayName.toLowerCase().indexOf(key);
        if (f != -1) {
          if (item.rayavaran_Loinc_Method_Code  == this.status_ta) {
            this.serchlist.push(item)
          }
        } else {
          const f =  item.displayName.toLowerCase().indexOf(key);
          if (f != -1) {
            if (item.rayavaran_Loinc_Method_Code  == this.status_ta) {
              this.serchlist.push(item)
            }
          }
        }
      }
    });


  }
  show_messeg(mess: any, sh: boolean) {
    this.messgshow = sh;
    this.messag = mess;
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
  postDatestartdate(event: any) {
    this.expiryDate = event;
    console.log(this.expiryDate)
  }
  save() {
    if (this.datafinal.length > 0) {
      this.loading = true;
      console.log(this.datafinal)
      this._labReq.tasvirbardari(this.datafinal, this.dateObject1, this.SendData, this.status_ta).subscribe(p => {
        this.getlist_lab();
       // this.SendData = []
        this.result = p;
        console.log(p);
        this.loading = false;
        this.datafinal = [];
        this.value = '';

      });
    } else {
      alert('هیچ خدمتی برای ارسال انتخاب نشده است');
    }

  }
  Get_Last_History_Of_Observation(name: any) {
    this.detail = JSON.parse(localStorage.getItem('detailenconter'));
    this.datafinal.forEach(p => {
      if (p['name'] === name) {
        this._labReq.gethistorylab(this.customerobj['patientID'], p['masterServiceID']).subscribe(res => {
          this.historylab = res;
        })
        console.log('tttt',this.historylab )
      }
    })
  }
  change(event: any ) {
    alert(event)
    this._labReq.getlistitem('2').subscribe(res => {
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
      alert('آزمایش به لیست پرکاربرد اضافه شد');
    })
  }

  async deletmozmen(id: any) {
    await this._labReq.deletfavlab(id).subscribe(p => {
      this._labReq.getlabfav().subscribe(p => {
        this.result1 = p['items'];
        this.labfav = [];
        this.result1.forEach(e => {
          const  g = JSON.parse(e['jsonValue']);
          this.listdrug['items'].forEach( b => {
            if (g['displayName'] == b['displayName']) {
              const content1 = {
                'id': e['id'],
                'res' : JSON.parse(e['jsonValue'])
              };
              this.labfav.push(content1);
            }
          })
        })
      });
    })
  }

  setfav(i: any) {
    const chek = false;
    if (this.datafinal.length > 0) {
      this.datafinal.forEach( p => {
        if (i['name'] == p['name']) {
          alert('درخواست قبلا انتخاب شده است');
        } else {
          this.datafinal.push(i);
        }
      })
    } else {
      this.datafinal.push(i);
    }

  }

  setstatus(id: number ) {
    this.datafinal = [];
    this.count = 0;
    this.result = null;
    this.SendData = [];
    if (id == 1) {
    this.status_ta = '2.1';
    this.datafinal = [];
    this.getlist_lab();
    }
    if (id == 2) {
      this.status_ta = '2.2';
      this.datafinal = [];
      this.getlist_lab();
    }
    if (id == 3) {
      this.status_ta = '2.4';
      this.datafinal = [];
      this.getlist_lab();
    }
    if (id == 4) {
      this.status_ta = '2.3';
      this.datafinal = [];
      this.getlist_lab();
    }
    if (id == 5) {
      this.status_ta = '2.5';
      this.datafinal = [];
      this.getlist_lab();
    }
    if (id == 6) {
      this.status_ta = '2.6';
      this.datafinal = [];
      this.getlist_lab();
    }
    if (id == 7) {
      this.status_ta = '2.7';
      this.datafinal = [];
      this.getlist_lab();
    }
  }
  getlist_body_system(code: any) {
    document.getElementById('div').style.opacity = '1'
    this.serchlistloink = [];
    this.listdrug['items'].forEach(item => {
      // console.log('item',item);
          if (item.rayavaran_Loinc_BodySystem_Code == code) {
          this.serchlistloink.push(item);
          }

    });
  }

  // listlabratory
  getlist_lab() {
    this._labReq.getlab_byenconter().subscribe( p => {
      let g;
      if (p['success']) {
        g = p['items'];
        if (g.length > 0) {
          g.forEach( u => {

            this.idm = u['id'];
            if (u['rayavaran_Loinc_Class_Code'] == '2' && u['rayavaran_Loinc_Method_Code'] == this.status_ta) {
                this.status = u['rayavaran_ServiceRequest_Status'];
                u.web_API_Service_Requset_Item_Views.forEach( h => {
                this.count = 1;
                const content =  { 'qty': '1', 'priorityIX': '0', 'displayName': h['service_DisplayName'] }
                this.datafinal.push(content);
                this.data = content;
              })
            }
          })
        }

      }
    })
  }
  closem() {
    this.messgshow = false;
    document.getElementById('test').focus();
  }
  saveedit() {

    const data = {
      'id': this.idm,
      'rayavaran_Loinc_Class_Code': '2',
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
        this.printValid = true;
        this.datafinal = [];
        this.value = '';
        // this.SendData = [];
        this.printValid = true;
        this.getlist_lab();
      } else {

      }
    });
  }
  add_item_to_list(item: any) {
    // this._salamatservice.getdetailtest(localStorage.getItem('salamattoken'), localStorage.getItem('salamatusertoken'), localStorage.getItem('citizentoken'), localStorage.getItem('samadcode'), item['national_code']).subscribe(p => {
    //   this.messg = p['resMessage'];
    // });
    const persons =  this.datafinal.find(x => x.displayName == item['displayName']);
    // tslint:disable-next-line:triple-equals
    if (!persons) {

        const OBJ = new Web_API_Service_Requset_Items;
        OBJ.qty = '1',
            OBJ.service_Terminology_ID = '13',
            OBJ.service_Code = item['loinc_code']
        this.SendData.push(OBJ)


      this.datafinal.push(item);
      console.log(this.datafinal)
      this.serchlist = null;
      this.labform.reset();
      document.getElementById('test').focus();
    } else {
      this.show_messeg('آزمایش تکراری یافت شد' , true);
      this.serchlist = null;
      // this.serchresult = [];
      this.labform.reset();
      document.getElementById('test').focus();
    }
  }
}
