import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {ILogin} from '../DTO/ILogin';
import {ApiconfigserviceService} from '../service/apiconfigservice.service';
import namedata1 from 'assets/config/config.json';
import {timeout} from 'rxjs/operators';
import {promises} from 'fs';
import {rejects} from 'assert';


@Injectable({
  providedIn: 'root'
})
export class PatientListServiceService {
    baseurl: string;
    private Url = '/api/EMR/Get_Practitioner_ToDay_OutPatient';
    private PractitionerUrl = '/api/EMR/Get_Practitioner_OutPatient_List';
    private pationurl = '/api/EMR/Get_Practitioner_OutPatient_Encounter_List';
    private getdetailurl = '/api/EMR/Get_Encounter';
    private chroniclisturl = '/api/DrugStore/Patient_Drug_Chronic_List';
    private Urlday = '/api/EMR/Get_Practitioner_ToDay_OutPatient';
    private chronicdelete = '/api/DrugStore/Delete_Patient_Drug_Chronic';
    private favdeleteurl = '/api/DrugStore/Delete_Practitioner_Drug_Favorite';
    private salamatseting = '/api/Setting/Get_User_Setting';
    private main_convertor_url = '/api/Hospital/Convert_MainCode_To_PatientID';
    private image_url = '/api/EMR/Get_Patient_Picture/';
    private pdata: Object;
    public results: any;

    constructor(private http: HttpClient) {
    }

    setMyGV(url: any) {
        this.baseurl = url;
    }

    getList(): Observable<any> {
        const headerDict = {
            'Authorization': 'Bearer  ' + localStorage.getItem('token')
        }
        return this.http.get<any>(this.baseurl + this.Url, {
            headers: headerDict
        });
    }

    getlistpation_inday(): Observable<any> {
        const headerDict = {
            'Authorization': 'Bearer  ' + localStorage.getItem('token')
        }
        return this.http.get<any>(this.baseurl + this.Urlday, {
            headers: headerDict
        });
    }

    postPractitioner(PersianStartDateFrom: string, PersianStartDateTo: string, isVisited: string, Patient_NationalCode: string) {
        const data = {
            'PersianStartDateFrom': PersianStartDateFrom,
            'PersianStartDateTo': PersianStartDateTo + ' ' + '23:59:59',
            'IsVisited': isVisited,
            'Patient_NationalCode': Patient_NationalCode,
            'patientID': ''
        };
        const body = JSON.stringify(data);
        const headers = {'Content-Type': 'application/json'};
        const headerDict = {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer  ' + localStorage.getItem('token')
        }
        const requestOptions = {
            headers: new Headers(headerDict),
        };
        return this.http.post<any>(this.baseurl + this.PractitionerUrl, body, {
            headers: headerDict
        });
    }

    postpationid(patientID: string): Observable<any> {

        const data = {
            'patientID': patientID
        };

        const body = JSON.stringify(data);
        const headers = {'Content-Type': 'application/json'};
        const headerDict = {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer  ' + localStorage.getItem('token')
        }

        const requestOptions = {
            headers: new Headers(headerDict),
        };

        return this.http.post<any>(this.baseurl + this.pationurl, body, {
            headers: headerDict
        });


    }

    maincode_topation(main: string) {
        const data = {
            'mainCode': main
        };

        const body = JSON.stringify(data);
        const headers = {'Content-Type': 'application/json'};
        const headerDict = {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer  ' + localStorage.getItem('token')
        }

        const requestOptions = {
            headers: new Headers(headerDict),
        };

        return this.http.post<any>(this.baseurl + this.main_convertor_url, body, {
            headers: headerDict
        });


    }

    getdetailpation(encounterID: string): Observable<any> {
        const data = {
            'encounterID': encounterID
        };

        const body = JSON.stringify(data);
        const headers = {'Content-Type': 'application/json'};
        const headerDict = {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer  ' + localStorage.getItem('token')
        }

        const requestOptions = {
            headers: new Headers(headerDict),
        };

        return this.http.post<any>(this.baseurl + this.getdetailurl, body, {
            headers: headerDict
        });


    }

    // medication_service

    chronicdruglist(patientid: string): Observable<any> {
        const data = {
            'patientid': patientid
        };

        const body = JSON.stringify(data);
        const headers = {'Content-Type': 'application/json'};
        const headerDict = {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer  ' + localStorage.getItem('token')
        }

        const requestOptions = {
            headers: new Headers(headerDict),
        };

        return this.http.post<any>(this.baseurl + this.chroniclisturl, body, {
            headers: headerDict
        });


    }

    deletchronic(id: string): Observable<any> {

        const data = {
            'id': id
        };

        const body = JSON.stringify(data);
        const headers = {'Content-Type': 'application/json'};
        const headerDict = {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer  ' + localStorage.getItem('token')
        }

        const requestOptions = {
            headers: new Headers(headerDict),
        };

        return this.http.post<any>(this.baseurl + this.chronicdelete, body, {
            headers: headerDict
        });


    }

    getsalamatseting() {

        const data = {
            'setting_Key': 'Insurer_UserNameAndPassword_khadamateDarmani'
        };

        const body = JSON.stringify(data);
        const headers = {'Content-Type': 'application/json'};
        const headerDict = {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer  ' + localStorage.getItem('token')
        }

        const requestOptions = {
            headers: new Headers(headerDict),
        };

        return this.http.post<any>(this.baseurl + this.salamatseting, body, {
            headers: headerDict
        });


    }

    search() {
        const promise = new Promise((resolve, reject) => {
         return this.http.get<any>('').toPromise().then()

        })
    }

}
