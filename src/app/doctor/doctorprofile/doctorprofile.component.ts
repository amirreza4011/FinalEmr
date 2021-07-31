import {Component, forwardRef, Inject, Injectable, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {CustomersService} from '../../core/store/customers.service';
import {Subscription} from 'rxjs';
import {ApiconfigserviceService} from '../../service/apiconfigservice.service';
import {ProfileseviceService} from '../../services/profilesevice.service';
import {LabReqService} from '../../services/labratoryRequest/lab-req.service';
import {PrescriptionServicesService} from '../../services/prescription-services.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-doctorprofile',
  templateUrl: './doctorprofile.component.html',
  styleUrls: ['./doctorprofile.component.css']
})

export class DoctorprofileComponent implements OnInit {
   type = 1;
  profileform: FormGroup;
  customers: any;
  serchresult: any;
  subs = new Subscription();
  customerobj: any;
  favdrug = new Array();
  favlabe = new Array();
  itemset = new Array();
  serchlist:  Array<any> = [];
  datafinal:  Array<any> = [];
  listdrug: any[];
  labform: FormGroup;
   name: any;
  listItem: any;
   messgshow: boolean;
   messag: any;
  // ---------
  editrecord: any;
  generic: any;
  erX_Code: any;
  drugid: any;
  signupForm: FormGroup;
  listfrequncy: any;
  value: any;
   paclist: [];
   fav_id: any;
  list_lab_master = new Array();
  constructor(
      private fb: FormBuilder,
      private customersService: CustomersService,
      private  i: ApiconfigserviceService,
      private _ser: ProfileseviceService,
      private _labReq: LabReqService,
      private  _service: PrescriptionServicesService,
      private router: Router,


  ) {
      this._ser.seturl(this.i.config.API_URL);
      this._labReq.seturl(this.i.config.API_URL);
      this._service.setMyGV(this.i.config.API_URL);
    }
    ngOnInit() {
      this.list_lab_master = null;
      this.listdrug = null;
      this._service.getpac().subscribe(p => {
        this.paclist = p;

      });
      this.get_list_lab();

    this.subs.add(this.customersService.stateChanged.subscribe(state => {
      if (state) {
        this.customers = JSON.stringify(state.customer['res']);
        this.customerobj = JSON.parse(this.customers);
      }
    }));
    this.profileform = this.fb.group({
      'name': ['', Validators.required ],
    });
      this.labform = this.fb.group({
        'labname': ['', Validators.required ],
      });
      this._service.frequncylist().subscribe(p => {
        this.listfrequncy = p;
      });


    }
  async pars(y) {
    await   y['items'].forEach( item => {
     const data = [];
    const  p = item['jsonValue'] ? JSON.parse(item['jsonValue']) : '' ;
    if (p) {
      // tslint:disable-next-line:no-shadowed-variable
      const data = [];
      p.forEach( h => {
      data.push(h);
      });
      const content = {
        'id': item['id'],
        'favename': item['favoriteName'],
        'res': data
      };
      this.itemset.push(content);
    }


       });
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
    console.log('ddddd', d['loinC_Code']);
    if (this.i.config.lab_type == 'M') {
      const  data = {
        'masterServiceID': d['masterServiceID'],
        'orderTemplateID': '9000',
        'qty': '1',
        'priorityIX': '0',
        'name': d['displayName'],
      };
      this.add_item_to_list(data);
    } else {
      const  data = {
        'masterServiceID': d['loinC_Code'],
        'orderTemplateID': '9000',
        'qty': '1',
        'priorityIX': '0',
        'name': d['displayName'],
      };
      this.add_item_to_list(data);
    }


  }
  add_item_to_list(item: any) {
    const persons =  this.datafinal.find(x => x.name == item['name']);
    // tslint:disable-next-line:triple-equals
    if (!persons) {
      this.datafinal.push(item);
      this.serchlist = null;
      this.serchresult = [];
      this.labform.reset();
      document.getElementById('test1').focus();
    } else {
      this.show_messeg('آزمایش تکراری یافت شد' , true);
      this.serchlist = null;
      this.serchresult = [];
      this.labform.reset();
      document.getElementById('test1').focus();
    }
  }
  get_list_lab() {
    if (this.i.config.lab_type == 'L') {
      this._labReq.getlistitem('1').subscribe((res) => {
        this.list_lab_master = null;
        this.listdrug = res;
        this._ser.gae_fav(1).subscribe( h => {
          this.itemset = [];
          this.pars(h);
        });
      });
    } else {
      this._labReq.get_list_lab_bymaster().subscribe( result => {
        this.listdrug = null;
        this.list_lab_master = result;
        this._ser.gae_fav(1).subscribe( h => {
          this.itemset = [];
          this.pars(h);
        });
      })
    }
  }
  show_messeg(mess: any, sh: boolean) {
    this.messgshow = sh;
    this.messag = mess;
  }
  settype(val: any) {
    alert('type')
    this.type = val;
    this._ser.gae_fav(this.type).subscribe( h => {
      this.itemset = [];
      this.favdrug = h['items'];
      // tslint:disable-next-line:no-shadowed-variable
      this.favdrug.forEach( p => {
        const  content = {
          'id': p['id'],
          'favename': p['favoriteName'],
          'res' : p['jsonValue'] ? JSON.parse(p['jsonValue']) : ''
        };
        this.itemset.push(content);
      })
      console.log('dddddd', this.itemset)
    });
  }
  fav_nos_droug() {
    this.router.navigate(['/DoctorDashboard/add_drug_nos']);
  }
  onSubmit() {
    if (this.profileform.value.name != '') {
      if (this.type === 2) {
        this._ser.create_fav(this.profileform.value.name, this.type).subscribe( p => {
          this._ser.gae_fav(2).subscribe( h => {
            this.itemset = [];
            this.pars(h)
            // this.favdrug = h['items'];
            // // tslint:disable-next-line:no-shadowed-variable
            // this.favdrug.forEach( p => {
            //   const  content = {
            //     'id': p['id'],
            //     'favename': p['favoriteName'],
            //     'res' : p['jsonValue'] ? JSON.parse(p['jsonValue']) : ''
            //   };
            //   this.itemset.push(content);
            // })
            // console.log('dddddd', this.itemset)
          });
        });
      } else {
        this._ser.create_fav(this.profileform.value.name, this.type).subscribe( p => {
          this._ser.gae_fav(1).subscribe( h => {
            this.itemset = [];
            this.favdrug = h['items'];
            // tslint:disable-next-line:no-shadowed-variable
            this.favdrug.forEach( p => {
              const  content = {
                'id': p['id'],
                'favename': p['favoriteName'],
                'res' : p['jsonValue'] ? JSON.parse(p['jsonValue']) : ''
              };
              this.itemset.push(content);
            })
          });
        });
      }
      this.profileform.reset();
      document.getElementById('test').focus();
    }
  }

  delete(id: any) {
    if (confirm('برای حذف اطمینان دارید؟')) {
      this._ser.delet_fav(id).subscribe( p => {
        this._ser.gae_fav(this.type).subscribe( h => {
          this.itemset = [];
          this.favdrug = h['items'];
          this.favdrug.forEach( p => {
            console.log('ppppppppp', p['id'])
            const  content = {
              'id': p['id'],
              'favename': p['favoriteName'],
              'res' : p['jsonValue'] ? JSON.parse(p['jsonValue']) : ''
            };
            this.itemset.push(content);
          })
          console.log('dddddd', this.itemset)
        });
      })
    }

  }
  savedata() {
    if (this.datafinal.length > 0) {
      this._ser.Add_fav(this.fav_id , this.datafinal).subscribe(res => {
        if (res.success === true) {
          this.datafinal = [];
          this.show_messeg('اطلاعات با موفقیت ثبت شد' , true);
          this._ser.gae_fav(1).subscribe( h => {
            this.itemset = [];
             this.pars(h);
          });
        }
      })
    } else {
      this.show_messeg('آزمایشی برای ارسال انتخاب نشده است' , true);
    }
  }

  getDose(value: string) {

  }
  closem() {
    this.messgshow = false;
    document.getElementById('test').focus();
  }
  deleteItem(i) {
    this.datafinal.splice(i, 1)
  }
  set_id(id: any) {
    this.fav_id = id;
    if (this.itemset.length > 0) {
      this.itemset.forEach( p => {
        if (p['res']) {
          if (p['id'] == this.fav_id) {
            p['res'].forEach( h => {
              this.datafinal.push(h);
            })
          }
        }

      })
    }
  }
}
