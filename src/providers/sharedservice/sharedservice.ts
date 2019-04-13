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
  public medicinesArrays=new BehaviorSubject([]);
  public treatmentArray=new BehaviorSubject([]);
  // public medicines:any=[];
  private isModal = new BehaviorSubject<boolean>(false);
  private networkStatus=new BehaviorSubject<string>('');
  // isModalOpen = this.isModal.asObservable();

  constructor(public http: Http) {
    console.log("Hello SharedserviceProvider Provider");
  }
  public update(data: any) {
    this.bSubject.next(data);
    console.log("got data" + data);
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

  setnetworkStat(stat){
    this.networkStatus.next(stat);
  }

  getNetworkStat(){
   return this.networkStatus.asObservable();
  }


  // gettreatmentdetails(data)
  // {
  //   this.treatmentArray.next(data);

  // }

}
