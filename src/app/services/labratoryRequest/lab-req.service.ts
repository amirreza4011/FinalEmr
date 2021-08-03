import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs/observable';
import namedata from '../../../assets/config/config.json';
import {promises} from 'fs';

@Injectable({
  providedIn: 'root'
})
export class LabReqService {
  private  servicurl =     '/api/Hospital/ListOfServiceGroup';
  private  saveurl =     '/api/Laboratory/Create_New_Order';
  private  listservicename =     '/api/Hospital/ListOfService';
  private  historylaburl =     '/api/Laboratory/Get_Last_History_Of_Observation';
  private  favlaburl =     '/api/Laboratory/Get_Practitioner_Laboratory_Favorite';
  private  favurl =     '/api/Laboratory/Create_New_Practitioner_Laboratory_Favorite';
  private  deletfavurl =     '/api/Laboratory/Delete_Practitioner_Laboratory_Favorite';
  private  getrequsthis =  '/api/Laboratory/Get_Laboratory_Order_Encounter';
  private  get_labhis_url =  '/api/Laboratory/Get_Laboratory_Order_Encounter';
  private  update_url =  '/api/Laboratory/Update_Order';
  private listlab_enconterurl = '/api/Laboratory/Get_Orders_By_Encounter';
  private master_list_lab_url = '/api/Hospital/ListOfLaboratoryMasterService';
  baseurl: any;


  constructor( private  http: HttpClient) { }
  seturl(url: any) {
    this.baseurl = url;
  }
  getlabfav(): Observable<any> {
    const headerDict = {
      'Authorization': 'Bearer ' + localStorage.getItem('token')
    }
    const requestOptions = {
      headers: new Headers(headerDict),
    };
    return   this.http.get<any>(this.baseurl + this.favlaburl, {
      headers: headerDict
    });

  }
  get_list_lab_bymaster(): Observable<any> {
    const headerDict = {
      'Authorization': 'Bearer ' + localStorage.getItem('token')
    }
    const requestOptions = {
      headers: new Headers(headerDict),
    };
    return   this.http.get<any>(this.baseurl + this.master_list_lab_url, {
      headers: headerDict
    });

  }
  favariteList(item: any): Observable <any> {
    const data = {
      'jsonValue': JSON.stringify(item),
    }
    const body = data;
    const headerDict = {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer  ' + localStorage.getItem('token')
    }
    console.log(body);
    return this.http.post<any>(this.baseurl + this.favurl, body, {
      headers: headerDict
    })
  }
  insertlab(list: any, date: string, SendData: any): Observable <any> {

    const data = {
      'rayavaran_Loinc_Class_Code': '1',
      
      'encounterID': localStorage.getItem('encounterID'),
      'expiryDate': date.toString(),
      'jsonvalue': JSON.stringify(list),
      'web_API_Service_Requset_Items': SendData,
    }
    const body = JSON.stringify(data );
    console.log(body)
    const headerDict = {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer  ' + localStorage.getItem('token')
    }
    console.log(body);
    return this.http.post<any>(this.baseurl + this.saveurl, body, {
      headers: headerDict
    })
  }
  tasvirbardari(list: any, date: any, SendData: any , type: any): Observable <any> {

    const data = {
      'rayavaran_Loinc_Class_Code': '2',
      'rayavaran_Loinc_Method_Code': type,
      'encounterID': localStorage.getItem('encounterID'),
      'expiryDate': '1400-12-20',
      'jsonvalue': JSON.stringify(list),
      'web_API_Service_Requset_Items': SendData,
    }
    const body = JSON.stringify(data );
    console.log('data instance:',body)
    const headerDict = {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer  ' + localStorage.getItem('token')
    }
    console.log(body);
    return this.http.post<any>(this.baseurl + this.saveurl, body, {
      headers: headerDict
    })
  }

  getlistitem(id: any): Observable <any> {
    const data = {
      'rayavaran_Loinc_Class_Code': id.toString(),
    }
    const body = JSON.stringify(data );
    console.log(body)
    const headerDict = {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer  ' + localStorage.getItem('token')
    }
    console.log(body);
    return this.http.post<any>(this.baseurl + this.listservicename, body, {
      headers: headerDict
    })
  }
  deletfavlab(id: any): Observable <any> {
    const data = {
      'id': id,
    }
    const body = JSON.stringify(data );
    console.log(body)
    const headerDict = {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer  ' + localStorage.getItem('token')
    }
    console.log(body);
    return this.http.post<any>(this.baseurl + this.deletfavurl, body, {
      headers: headerDict
    })
  }
  gethistorylab(patientid: any, masterServcieID: any): Observable <any> {
    const data = {
      'patientid': patientid,
      'masterServcieID': masterServcieID
    }
    const body = JSON.stringify(data );
    console.log(body)
    const headerDict = {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer  ' + localStorage.getItem('token')
    }
    console.log(body);
    return this.http.post<any>(this.baseurl + this.historylaburl, body, {
      headers: headerDict
    })
  }
  gethistory_en(): Observable <any> {
    const data = {
      'encounterID': localStorage.getItem('encounterID'),
    }
    const body = JSON.stringify(data );
    console.log(body)
    const headerDict = {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer  ' + localStorage.getItem('token')
    }
    console.log(body);
    return this.http.post<any>(this.baseurl + this.getrequsthis, body, {
      headers: headerDict
    })
  }

  Get_Laboratory_Order_Encounter(customerobjElement: any) {

    const data = {
      'encounterLocationID': customerobjElement
    }
    const body = JSON.stringify(data );
    console.log(body)
    const headerDict = {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer  ' + localStorage.getItem('token')
    }
    console.log(body);
    return this.http.post<any>(this.baseurl + this.get_labhis_url, body, {
      headers: headerDict
    })
  }
    Update_Laboratory_Order(list: any) {


      // const data = {
      //   'id': id,
      //   'rayavaran_Loinc_Class_Code': '1',
      //   'encounterID': localStorage.getItem('encounterID'),
      //   'expiryDate': date.toString(),
      //   'jsonvalue': JSON.stringify(list),
      //   'web_API_Service_Requset_Items': SendData,
      // }
    const body = JSON.stringify(list );
      console.log('update lab:', body);
    const headerDict = {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer  ' + localStorage.getItem('token')
    }
    console.log(body);
    return this.http.post<any>(this.baseurl + this.update_url, body, {
      headers: headerDict
    })
  }

  getlab_byenconter(): Observable <any> {

    const data = {
      'encounterID': localStorage.getItem('encounterID'),
    }
    const body = JSON.stringify(data );
    console.log(body)
    const headerDict = {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer  ' + localStorage.getItem('token')
    }
    console.log(body);
    return this.http.post<any>(this.baseurl + this.listlab_enconterurl, body, {
      headers: headerDict
    })

  }
}
