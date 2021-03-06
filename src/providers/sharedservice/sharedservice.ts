import { Injectable } from "@angular/core";
import { Http } from "@angular/http";
import "rxjs/add/operator/map";
import { BehaviorSubject, Subject } from "rxjs/Rx";

/*
  Generated class for the SharedserviceProvider provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular DI.
*/

@Injectable()
export class SharedserviceProvider {

  public bSubject = new BehaviorSubject("a");
  public medicinesArrays = new BehaviorSubject([]);
  public treatmentArray = new BehaviorSubject([]);
  // public medicines:any=[];
  private isModal = new BehaviorSubject<boolean>(false);
  private networkStatus = new BehaviorSubject<string>('');
  private linkid = new BehaviorSubject<string>('');
  private location = new BehaviorSubject<object>({});
  public httpresponse = new BehaviorSubject<object>({});
  public triggerhttp = new BehaviorSubject<object>({});
  public readNFC = new BehaviorSubject<object>({});
  public fetchNotification = new BehaviorSubject<object>({});
  public fetchProfile = new BehaviorSubject<object>({});
  public fetchDevices = new BehaviorSubject<object>({});

  // isModalOpen = this.isModal.asObservable();

  constructor(public http: Http) {

  }
  public update(data: any) {
    this.bSubject.next(data);

  }
  public filterhistories(data: any) {
    this.bSubject.next(data);
  }

  // getmedicinelist(data)
  // {  
  //   this.medicinesArrays.next(data);

  // }


  // setModalOpen(val: boolean) {
  //   this.isModal.next(val);
  // }

  // getModalOpenState() {
  //   return this.isModal.asObservable();
  // }

  setnetworkStat(stat) {
    this.networkStatus.next(stat);
  }

  getNetworkStat() {
    return this.networkStatus.asObservable();
  }
  locations(stat) {
    this.location.next(stat);
  }
  getlocation() {
    return this.location.asObservable();
  }
  setlinkid(stat) {
    this.linkid.next(stat);
  }
  getlinkid() {
    return this.linkid.asObservable();
  }


  // gettreatmentdetails(data)
  // {
  //   this.treatmentArray.next(data);

  // }


  // newly written code - Pushpendu Ghosh
  httpLoad(response) {
    return this.httpresponse.next(response)
  }

  loadHttp(type) {
    return this.triggerhttp.next(type)
  }

  scanNFC(value) {
    return this.readNFC.next({ value: value })
  }

  triggerNotification(value) {
    return this.fetchNotification.next({ value: value })
  }

  triggerProfile(value) {
    return this.fetchProfile.next({ value: value })
  }

  triggerDevices(value) {
    return this.fetchDevices.next({ value: value })
  }


}
