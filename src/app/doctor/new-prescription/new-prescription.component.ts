import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {PrescriptionServicesService} from '../../services/prescription-services.service';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {Customer} from '../../core/store/customer';
import {Subscription} from 'rxjs';
import {CustomersService} from '../../core/store/customers.service';
import {validate} from 'codelyzer/walkerFactory/walkerFn';
import {SalamatserviceService} from '../../services/salamatservice.service';
import {ApiconfigserviceService} from '../../service/apiconfigservice.service';
import {ProfileseviceService} from '../../services/profilesevice.service';
import {PatientListServiceService} from '../../services/patient-list-service.service';
import {HospitalService} from '../../services/hospital/hospital.service';

@Component({
  selector: 'app-new-prescription',
  templateUrl: './new-prescription.component.html',
  styleUrls: ['./new-prescription.component.scss']
})
export class NewPrescriptionComponent implements OnInit {
    routearray=[]
    hospital: any;
    myIndex:number
    printValid = false
   generic: any;
   historydrougenconter: any;
   listdrugerx: any;
   status: any;
   favdrug: any;
   testd: any;
   resedit: any;
   encounterId: string;
   defultdrugstore: any;
   liststore: any;
   resultmozmen: any;
   chek_brand: Boolean;
   error_m: any;
   trakingcode: any;
   alarm: any[];
   re: any;
   sepashid: any;
  signupForm: FormGroup;
  customers: any;
  stateHistory = null;
  isHistoryVisible = false;
  subs = new Subscription();
  list1: any;
  termin_saleble_id: any;
  pharmacy = '';
  listdrug: any[];
  term: '';
  serchlist = new Array();
  value = '';
  addtempdrug = new Array();
  Frequency = '';
  Dispense = '';
  Dose = '';
  id1 = '';
  qualifier = '';
  Administration = '';
  Duration = '';
  Direction = '';
  myControl = new FormControl();
  DAW: boolean;
  doseText = '';
  DurationText = '';
  dispenseText = '';
  route1 = '';
  routeid= '';
  listItem: any;
  title = '';
  favariteList: [];
  json = '';
  fava: any;
  show = 'none';
  detail = '';
  paclist: [];
  frequncyid: '';
  ressenddata = 'no';
  load = false;
  datafinal:  Array<any> = [];
  cheklist:  Array<any> = [];
  datasepas:  Array<any> = [];
  favlist:  Array<any> = [];
  listroute: [];
  ischek = false;
  editrecord: any;
   disid: any;
   drugid: any;
   customerobj: any;
   listfrequncy: any;
   config: any;
   messg: any;
   drug_mode: any;
   erX_Code: any;
   favtemplist:  Array<any> = [];
   checked: any;
   url: any;
   mozmenlist:  Array<any> = [];
   messgshow: boolean;
   messag: any;
   typemodal: number;
   issalamat: boolean;
   arrowkeyLocation = 0;
   index: number;
    // مخزن داده
    salamatcode: any;
    show_id: any;
    prac_name: any;
   // سازنده کلاس
    sepas_id: any;

    constructor(
      private router: Router,
      private route: ActivatedRoute,
      private  _service: PrescriptionServicesService,
      private modalService: NgbModal,
      private customersService: CustomersService,
      private fb: FormBuilder,
      private element: ElementRef<HTMLInputElement>,
      private  _salamatservice: SalamatserviceService,
      private  i: ApiconfigserviceService,
      private _ser: ProfileseviceService,
      private  _servicemozmen: PatientListServiceService,
      private _serviceh: HospitalService,

              ) {
    this._service.setMyGV(this.i.config.API_URL);
        // tslint:disable-next-line:triple-equals
    if (this.i.config.drug_mode == 'E') {
        this.termin_saleble_id = 7;
    } else {
        this.termin_saleble_id = 6;
    }
    this._ser.seturl(this.i.config.API_URL);
    this.issalamat = this.i.config.salamt_api;
    this.url = this.i.config.API_URL;
    this._servicemozmen.setMyGV(this.i.config.API_URL);
    this._salamatservice.seturl(this.i.config.salamat_url);
    this.route.paramMap.subscribe(params => {
      this.pharmacy = params.get('');

    });
      this.drug_mode = this.i.config.drug_mode;
      this.chek_brand = true;
      this._service.set_sepas(this.i.config.sepas_url);

    this._service.getpac().subscribe(p => {
      this.paclist = p;
    });
  }
    // کلید بالا و پایین

    save(event) {

        switch (event.keyCode) {
            case 13:
                // this.searchText=event.target.value;
                break;
            case 38:
                if (this.arrowkeyLocation < 1 ) {
                    this.arrowkeyLocation = 1
                }
                this.index = this.arrowkeyLocation-- - 2
                document.getElementById('ul').scrollBy(-40, -40);
                console.log('arrow', this.index)
                break
            case 40:
                this.index = this.arrowkeyLocation++;
                if (this.arrowkeyLocation > 11) {
                    document.getElementById('ul').scrollBy(18, 18);
                }
                document.getElementById('ul').scrollBy(40, 40);
                console.log('arrow', this.index)
                break
        }


    }
    getdata() {
        this._servicemozmen.getdetailpation(localStorage.getItem('encounterID')).subscribe(p => {
            const cust = {
                'id': 1,
                'state': '2',
                'res': p
            };
            this.customersService.add(cust);
        });
    }
    getlistdrug_byenconter() {
        this._service.getlistdrug(localStorage.getItem('encounterID')).subscribe( h => {
            if (h['success'] == true) {
                this.printValid = true;
                this.resedit = h['items'][0];
                this.status = h['items'][0] ? h['items'][0]['rayavaran_WardRequest_Status_Code'] : '';
                h['items'].forEach( l => {
                    this.historydrougenconter = JSON.parse(l['jsonValue'])
                    const g = JSON.parse(l['jsonValue']);

                    g.forEach( k => {
                        // if ( k['Duration']==='nullnull'){
                        //     k['Duration'] = ""
                        // }
                        this.listItem.push(k)
                        console.log("qwqwqwqwqwqwqwq",this.listItem)

                    })
                })
            }
        });
    }

  async  ngOnInit() {


        this._serviceh.getAll().subscribe(res => {
            this.hospital = res.hospitalName
        });
        this.prac_name = localStorage.getItem('doc_name')
        this.getdata();
        // document.getElementById('namedrug').focus();
        this.cheklist = [];
        this.typemodal = 1;
        this.messgshow = false;
        this._service.getService().subscribe( res => {
      this.liststore = res;
      res.forEach(p => {
        if (p.iS_Default_Pharmacy === true) {
          this.id1 = p.id;
          this.defultdrugstore = p.name;
        }

      });

     this._service.getdruglist(this.id1).subscribe( res => {
        this.listdrug = res;

      })

    });

        this._ser.gae_fav(2).subscribe( h => {
      this.favdrug = h['items'];
      console.log(h);
    })
        this.getlistdrug_byenconter();

    this._service.getFavList().subscribe( res => {
      this.favariteList = res['items'];
      this.favariteList.forEach(p => {
        const content1 = {
          'id': p['id'],
          'res': JSON.parse(p['jsonValue'])
        };
        this.favlist.push(content1);
      })
    });
    this.config = localStorage.getItem('conf');

    this.subs.add(this.customersService.stateChanged.subscribe(state => {
      if (state) {
        this.customers = JSON.stringify(state.customer['res']);
        this.customerobj = JSON.parse(this.customers);
      }
    }));
    if (this.customerobj) {
    try {
     this._servicemozmen.chronicdruglist(this.customerobj['patientID']).subscribe(p => {
         this.resultmozmen = p['items'];
         this.resultmozmen.forEach(e => {
             const content = {
                 'id': e['id'],
                 'res' : JSON.parse(e['jsonValue'])
             };
             this.mozmenlist.push(content);
         })
     });
 } catch (e) {
   console.log('mess', e.toString());

 }

    }
    this.signupForm = this.fb.group({
      'drugname': ['', Validators.required ],
      'Frequency': ['', Validators.required ],
      'drugid': new FormControl(null),
      'Dosetext': ['', Validators.required ],
      'Doseselect': ['', Validators.required ],
      'TNOtext': ['', Validators.required ],
        'TNOselect': ['', Validators.required ],
      'Route' : ['0-  '],
      'qualifier': [''],
      'Administration' : [''],
      'Durationtext' : [''],
      'Durationselect' : [''],
      'Directions' : [''],
      'generic_Code' : [''],
      'erX_Code' : [''],
      'sepas_id' : ['']
    })
    this.listItem = [];




      this._service.geterxdrug().subscribe( res => {
        this.listdrugerx = res['items'];
      })



    this._service.routelist().subscribe(p => {
      this.listroute = p;
    });
    this._service.frequncylist().subscribe(p => {
      this.listfrequncy = p;
    })
  }
  read() {
    this.show = 'yes';
  }
  hide() {

    this.show = 'none';
  }
  onSearchChange(event: any) {

      // tslint:disable-next-line:triple-equals
   if (this.i.config.drug_mode == 'S' && this.termin_saleble_id == 6) {
       const key = event.target.value;
       this.serchlist = [];
       // tslint:disable-next-line:label-position
       // let serch = false;
       this.listdrug.forEach(item => {
           if (key === '') {
               this.serchlist = [];
           }
           // tslint:disable-next-line:triple-equals
           if (key != '' ) {
               // console.log('keyyyyyyyyyyy',key);
               const f = item.name ?  item.name.toLowerCase().substring(0, key.length) : '';
               if (key === f) {
                   // tslint:disable-next-line:max-line-length
                   this.serchlist.push({'name': item.name, 'id': item.id, 'iscomisin': item.isCommission, 'qty': item.storage_Qty})
                   // serch = true;

               }
           }
       });
   }
      // tslint:disable-next-line:triple-equals
      if (this.i.config.drug_mode == 'E' || this.termin_saleble_id == 7) {
          const key = event.target.value;
          this.serchlist = [];
          // tslint:disable-next-line:label-position
          // let serch = false;
          this.listdrugerx.forEach(item => {
              if (key === '') {
                  this.serchlist = [];
              }
              // tslint:disable-next-line:triple-equals
              if (key != '' ) {
                  // console.log('keyyyyyyyyyyy',key);
                  const f = item.value ?  item.value.toLowerCase().substring(0, key.length) : '';
                  if (key === f) {
                      if (this.chek_brand == true) {
                          // tslint:disable-next-line:triple-equals
                          if (item.isBrand == true) {
                              // tslint:disable-next-line:max-line-length
                              this.serchlist.push({'name': item.value, 'id': item.code, 'iscomisin': false, 'qty': 1000})
                              // serch = true;
                          }
                      } else {
                          // tslint:disable-next-line:max-line-length
                          this.serchlist.push({'name': item.value, 'id': item.code, 'iscomisin': false, 'qty': 1000})
                          // serch = true;
                      }

                  }
              }
          });
      }
  }
  set(d: any , content: any) {
      this.typemodal = 3;
      this.modalService.open(content, { size: 'lg' }).result.then((result) => {
      }, (reason) => {

      });
    this.value = d['name'];
    this.drugid = d['id'];
    this.generic = d['generic_Code'];
    this.erX_Code = d['erX_Code'];
    this.serchlist = [];
  }
  getFrequency(value: any) {
    const s = value.split('-', 2);
    this.frequncyid = s[0];
    console.log(this.frequncyid)
    this.Frequency = s[1];
      console.log(this.Frequency)
      document.getElementById('dosep').focus();
  }
  getDose(value: any) {
    this.Dose = value;
      document.getElementById('tnamber').focus();
  }
  getQualifier(value: any) {
    this.qualifier = value;
  }
  getAdministration(value: any) {
    this.Administration = value;
  }
  getDuration(value: any) {
    this.Duration = value;
      console.log("duration",this.Duration);
  }
  getDispense(value: any) {
    const s = value.split('-', 2);
    this.disid = s[0];
    this.Dispense = value;
  }
  getRoute(value: any) {
        console.log(value)
     this.route1 = value;
     const s = value.split('-', 2);
     console.log(s)
     this.routeid = s[0];
      console.log(this.routeid)
      this.route = s[1];
      console.log(this.route)
    //    document.getElementById('').focus();
  }
  sendsepas() {
        this.load=true;
      this.listItem.forEach(e => {
          const  d = {
              'Drug_eRxCode': e['drugid'],
              'Drug_TotalNumberValue': e['qty'].toString(),
              'Drug_TotalNumberUnit': 'mg',
              'Drug_FrequencyCode': e['Frequencyid'], // e['Frequencyid'],
              'Drug_RouteCode': '386357005' , // e['routeid']
          };
          this.datasepas.push(d);
      });
    this._service.sendsepas(this.datasepas , localStorage.getItem('encounterID') , localStorage.getItem('doc_id')).subscribe( p => {
        console.log(p);
        this.load=false;
        if (p.blnSuccess == true) {
            this.sepashid = p.strHID;
        } else {
            this.error_m = p.strError;
            this.sepashid= 'خطا در ارسال بسته به سپاس';
        }
    })
  }
  savedata() {
    this.listItem.forEach(e => {
      const d =  {
            'id': 0,
            'web_API_Drug_Requset_ID': 0,
            'salable_Terminology_ID': this.termin_saleble_id,
            'salable_Code': e['drugid'],
            'qty': e['qty'],
            'frequencyUsage_SepasCode': e['Frequencyid'],
            'routeUsage_SepasCode': '',
            'packaging_Terminology_ID': 8,
            'packaging_Code': e['Tnomberid'],
            'patientInstruction': e['Directions']
        }
      this.datafinal.push(d);
    });
    if (this.datafinal.length > 0) {
        this.sendsepas();
      this.load = true;
      this._service.inserdruglist(this.listItem, this.datafinal, this.customerobj['currentLocationID'] , this.pharmacy).subscribe(res => {
        this.listItem = res;
        console.log('res:', res);
        this.load = false;
        this.datafinal = [];
        if (res['success'] == true) {
            this.printValid = true;
          this.listItem = [];
          this.value = '';
          this.ressenddata = 'yes';
          this.trakingcode = res['trackingNumber'];
          this.show_id = true;
          this.getlistdrug_byenconter();
        }
      })
    } else {
      this.show_messeg('دارویی برای ارسال انتخاب نشده است' , true);
    }

  }
  GetDetails(content) {
      this.typemodal = 1;
    this.favlist = [];
    this.modalService.open(content, { size: 'lg' }).result.then((result) => {
    }, (reason) => {

    });
    this._service.getFavList().subscribe( res => {
      this.favariteList = res['items'];
      this.favariteList.forEach(p => {
        const content1 = {
          'id': p['id'],
           'res': JSON.parse(p['jsonValue'])
        };
        this.favlist.push(content1);
      })
    })
  }

 async GetDetailsmozmen(content) {
      this.typemodal = 2;
      this.mozmenlist = [];
    this.modalService.open(content, { size: 'lg' }).result.then((result) => {
    }, (reason) => {

    });
     try {
         this._servicemozmen.chronicdruglist(this.customerobj['patientID']).subscribe(p => {
             this.resultmozmen = p['items'];
             this.resultmozmen.forEach(e => {
                 const content1 = {
                     'id': e['id'],
                     'res' : JSON.parse(e['jsonValue'])
                 };
                 this.mozmenlist.push(content1);
             })
         });
     } catch (e) {
         console.log('mess', e.toString());

     }
  }
  favLIst(i: any) {
      this._service.favariteList(i).subscribe(res => {
          this.favariteList = res ;
          this.show_messeg('دارو به لیست پرکاربرد اضافه شد', true)
      })

  }
  chronic(i: any) {
    this._service.savechronic(i, this.customerobj['patientID']).subscribe(p => {
      this.show_messeg('داروی مزمن اضافه شد' , true)
    });
  }
  deleteItem(i) {
    this.listItem.splice(i, 1)
  }
  addCustomer() {
    const cust = {
      'id': 1,
      'state': '1',
    };
    this.customersService.add(cust);
  }
  sendsalamat() {
      // tslint:disable-next-line:max-line-length
      this._salamatservice.save_no(localStorage.getItem('salamattoken'), localStorage.getItem('salamatusertoken'), localStorage.getItem('citizentoken'), localStorage.getItem('samadcode'), this.cheklist).subscribe(p => {
          this.messg = p['resMessage'];
          this.salamatcode =  p['resMessage4mth'];
      });
  }
    applyeditform(){
        console.log(this.signupForm.value)
        this.listItem.splice(this.myIndex, 1)
        this.printValid = true
        let frquncusplit;
        let TNO;
        let route;
        if (this.signupForm.value.Frequency) {
            frquncusplit = this.signupForm.value.Frequency.split('-', 2);

        }
        if (this.signupForm.value.TNOselect) {
            TNO = this.signupForm.value.TNOselect.split('-', 2);
        }
        if (this.signupForm.value.Route) {
            route = this.signupForm.value.Route.split('-', 2);


        }
        const content = {

            'drugname': this.signupForm.value['drugname'],
            'drugid': this.signupForm.value['drugid'],
            'fullfrequncy': this.signupForm.value['Frequency'],
            // 'Frequency': frquncusplit ? frquncusplit[1] : '',

            'Frequency': this.Frequency,
            // 'Frequencyid': frquncusplit ? frquncusplit[0] : '',
            'Frequencyid': this.frequncyid,
            'doseText': this.signupForm.value.Dosetext + '' + this.signupForm.value.Doseselect,
            'dosesel' : this.signupForm.value.Doseselect,
            'dosetxt' : this.signupForm.value.Dosetext,
            'qualifier': this.signupForm.value['qualifier'],
            'Administration': this.signupForm.value['Administration'],
            'Duration': this.signupForm.value['Durationtext'] + '' + this.signupForm.value['Durationselect'],
            'Durationname': this.signupForm.value['Durationtext'],
            'Durationsel':  this.signupForm.value['Durationselect'],
            'T.No': this.signupForm.value['TNOtext'] ,
            'Tnomberid': TNO ? TNO[0] : '',
            'tid_text': TNO ? TNO[1] : '',
            'Direction': this.signupForm.value['Directions'],
            // 'route': route ? route[1] : '' ,
             'route': this.route ,
             'routeid': this.routeid,
               'qty' : 0
        };
      this.listItem.push(content)
      this.modalService.dismissAll()
        this.signupForm.reset()
        this.editrecord=false
    }
  onSubmit() {
    console.log('form data : ', this.signupForm.value);
      this.printValid = true
        let frquncusplit;
        let TNO;
        let route;
        if (this.signupForm.value.Frequency) {
          frquncusplit = this.signupForm.value.Frequency.split('-', 2);

        }
        if (this.signupForm.value.TNOselect) {
          TNO = this.signupForm.value.TNOselect.split('-', 2);
        }
      if (this.signupForm.value.Route) {
          route = this.signupForm.value.Route.split('-', 2);
      }
        // tslint:disable-next-line:prefer-const
        let formdata = this.signupForm.value;
          // if (formdata['Durationtext']===null){
          //     formdata['Durationtext']=""
          // }
          // if (formdata['Durationselect']===null){
          //     formdata['Durationselect']=""
          // }
          // if (formdata['Dosetext']===null){
          //     formdata['Dosetext']=""
          // }
          // if (formdata['Doseselect']===null){
          //     formdata['Doseselect']=""
          // }
        const content = {

          'drugname': formdata['drugname'],
          'drugid': formdata['drugid'],
            'fullfrequncy': formdata['Frequency'],
          'Frequency': frquncusplit ? frquncusplit[1] : '',
          'Frequencyid': frquncusplit ? frquncusplit[0] : '',
          'doseText': formdata['Dosetext'] + '' + formdata['Doseselect'],
          'dosesel' : formdata['Doseselect'],
          'dosetxt' : formdata['Dosetext'],
          'qualifier': formdata['qualifier'],
          'Administration': formdata['Administration'],
          'Duration': formdata['Durationtext'] + '' + formdata['Durationselect'],
          'Durationname': formdata['Durationtext'],
          'Durationsel':  formdata['Durationselect'],
            'T.No': formdata['TNOtext'] ,
          'Tnomberid': TNO ? TNO[0] : '',
            'tid_text': TNO ? TNO[1] : '',
          'Direction': formdata['Directions'],
          'route': route ? route[1] : '' ,
          'routeid': route ? route[0] : '',
          'qty' : formdata['TNOtext']
        };
        if(content.Duration==='nullnull'){
            content.Duration=""
        }
        console.log('gggg',content)
        this.add_item_to_list(content);
        this.modalService.dismissAll()
  }
  findIndexToUpdate(newItem) {
    return newItem.id === this;
  }
  edit(i: any , content: any,index:number ) {
      this.myIndex = index
      // this.listItem.splice(index,1)
      // console.log(this.listItem)
      this.frequncyid= i['Frequencyid']
      this.Frequency=i['Frequency']
      this.signupForm.get('Frequency').setValue(i['Frequency'])
      this.signupForm.get('Frequency').clearValidators();
      this.signupForm.get('Frequency').updateValueAndValidity()
      // this.signupForm.value.Dosetext= i['dosetxt']
      this.signupForm.get('Dosetext').setValue(i['dosetxt'])
      this.signupForm.get('Dosetext').updateValueAndValidity()
      console.log(this.signupForm.value.Dosetext)
      this.signupForm.get('Doseselect').setValue(i['dosesel'])
      this.signupForm.get('Doseselect').updateValueAndValidity()



      this.signupForm.get('Route').setValue(i['route']+"-"+i['routeid'])
      this.routeid=i['routeid']
      this.route=i['route']

      this.signupForm.get('Route').updateValueAndValidity()
      this.signupForm.get('qualifier').setValue(i['qualifier'])
      this.signupForm.get('qualifier').updateValueAndValidity()
      this.signupForm.get('Administration').setValue(i['Administration'])
      this.signupForm.get('Administration').updateValueAndValidity()
      this.signupForm.get('TNOtext').setValue(i['T.No'])
      this.signupForm.get('TNOtext').clearValidators();
      this.signupForm.get('TNOtext').updateValueAndValidity()
      this.signupForm.get('TNOselect').setValue(i['Tnomberid'])
      this.signupForm.get('TNOselect').updateValueAndValidity()

      this.signupForm.get('Durationtext').setValue(i['Durationname'])
      this.signupForm.get('Durationtext').updateValueAndValidity()
      this.signupForm.get('Durationselect').setValue(i['Durationsel'])
      this.signupForm.get('Durationselect').updateValueAndValidity()


      this.editrecord = i;
          this.modalService.open(content, { size: 'lg' }).result.then((result) => {
          }, (reason) => {
          });
          this.typemodal = 3;

  }
  async deletfav(id: any) {
   await this._service.deletefav(id).subscribe(p => {
     this._service.getFavList().subscribe( res => {
       this.favariteList = res['items'];
       this.favlist = [];
         // tslint:disable-next-line:no-shadowed-variable
       this.favariteList.forEach( p => {
         const content1 = {
           'id': p['id'],
           'res': JSON.parse(p['jsonValue'])
         };
         this.favlist.push(content1);
       })
     })
    })
  }
  chekfav(i: any) {
      this.add_item_to_list(i);
  }
  setdrug(i: any , event: any) {
   if (i) {
     const  y = JSON.parse(i);
     y.forEach( p => {
       this.add_item_to_list(p);
     })
   } else {

   }
  }
  getID(value: string) {
    this.id1 = value;
    this._service.getdruglist(this.id1).subscribe( res => {
      this.listdrug = res;


    })
  }
  editsave() {
    this.listItem.forEach(e => {
      const  d = {
          'id': 0,
          'web_API_Drug_Requset_ID': 0,
          'salable_Terminology_ID': this.termin_saleble_id,
          'salable_Code': e['drugid'],
          'qty': e['qty'],
          'frequencyUsage_SepasCode': e['Frequencyid'],
          'routeUsage_SepasCode': '',
          'packaging_Terminology_ID': 8,
          'packaging_Code': e['Tnomberid'],
          'patientInstruction': e['Frequency'] + e['doseText']
      };
      this.datafinal.push(d);
      console.log(d)
        this.editrecord=false
    });

      const  content = {
        'id': this.resedit['id'],
        'rayavaran_WardRequest_ID': this.resedit['rayavaran_WardRequest_ID'],
        'wardRequestItems': this.datafinal,
        'jsonValue': JSON.stringify(this.listItem)
      }
     this._service.save_edite_drug(content).subscribe( j => {

         if (j['success']) {
             this.show_id = true;
             this.listItem = [];
             this.datafinal = [];
             this.printValid = true;
             this.ressenddata = 'yes';
             this.trakingcode = j['trackingNumber'];
             this.getlistdrug_byenconter();
             this.show_messeg(j['trackingNumber'], true)
         }
     })
      this.editrecord=false
  }
    setPrint(){
  localStorage.setItem('x','1')


        }
  add_item_to_list(item: any) {
console.log(item)
      if (this.editrecord) {
          // this.listItem.splice(item, 1);
         // this.re = this.editrecord['Frequency'];
         this.editrecord = null;
      }
          this._salamatservice.sendToTamin(item['drugid']).subscribe(p => {
              this.messg = p;
          })
          // tslint:disable-next-line:max-line-length
          this._salamatservice.getdetailnoskhe(localStorage.getItem('salamattoken'), localStorage.getItem('salamatusertoken'), localStorage.getItem('citizentoken'), localStorage.getItem('samadcode'), item).subscribe(p => {
              this.re = p;
              if (p['info'] ? p['info']['isAllowed'] == false : false) {
                  this.alarm = p['info']['message'];
              } else {
                  this.alarm = p['info'] ? p['info']['message'] : '';
                  this.cheklist.push(p['info']['checkCode']);

              }
          });
          const persons =  this.listItem.find(x => x.drugname == item['drugname']);
          // tslint:disable-next-line:triple-equals
          const persons_d =  this.listdrug.find(x => x.name == item['drugname']);

          // tslint:disable-next-line:triple-equals
          const  persons_d_e = this.listdrugerx.find(x => x.value == item['drugname']);

          if (!persons) {
              if (persons_d || persons_d_e) {
                  this.listItem.push(item);
                  document.getElementById('namedrug').focus();
                  this.show = 'none';
                  this.signupForm.reset();
                  if (this.i.config.drug_mode == 'S') {
                      this.termin_saleble_id = 6;
                      this.ischek = false;
                  }
                  this.ischek = false;
              } else {
                  document.getElementById('namedrug').focus();
                  this.show = 'none';
                  this.signupForm.reset();
                  this.show_messeg('نام دارو غیر معتبر میباشد' , true)
              }

          } else {
              document.getElementById('namedrug').focus();
              this.show = 'none';
              this.signupForm.reset();
              this.show_messeg('داروی تکراری یافت شد' , true)
          }



  }
    show_messeg(mess: any, sh: boolean) {
      this.messgshow = sh;
      this.messag = mess;
    }
    closem() {
        this.messgshow = false;
        this.show_id = false;
    }
    async  deletmozmen(id: any) {
        await  this._servicemozmen.deletchronic(id).subscribe(p => {
            this._servicemozmen.chronicdruglist(this.customerobj['patientID']).subscribe(p => {
                this.resultmozmen = p['items'];
                this.mozmenlist = [];
                this.resultmozmen.forEach(e => {
                    const content = {
                        'id': e['id'],
                        'res' : JSON.parse(e['jsonValue'])
                    };
                    this.mozmenlist.push(content);
                })
            });
        })
    }
    call(i: any) {
      if (i.checked) {
          this.chek_brand = false;
      } else {
          this.chek_brand = true;
      }
    }
    SetTerminology(e: any) {
      if (e.checked) {
          this.termin_saleble_id = 7;
          this.ischek = true;
      } else {
          this.termin_saleble_id = 6;
          this.ischek = false;
      }

    }
}

