import { Injectable } from '@angular/core';
import { RequestOptions, Headers, Http } from '@angular/http';
// import { Observable } from "rxjs/Rx";
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import{HttpClientModule} from '@angular/common/http';
// import { HttpClient } from '@angular/common/http/src/client';

@Injectable()
export class HttpProvider {

  // private headerOptions = new RequestOptions({
  //   headers: new Headers({
  //     'Content-Type': 'application/json'
  //   }),
  // });
  // private url = 'https://memeapi.memeinfotech.com'

  constructor(private http: Http) { }

  /** requests configuration **/
  apiKey: string = "0122fa59258caf29929302774f79f549e45c51662bfe2d6ccf58bf4b67c316fc";

  /** delete user **/
  delete(url: string, id) {
    let base = this;
    return new Promise(function (resolve, reject) {
      let headers = new Headers();
      headers.append('content-type', 'application/json');
      headers.append('X-DreamFactory-API-Key', base.apiKey);

      let body = { "resource": [{ "id": id }] };
      let options = new RequestOptions({ headers: headers, body: body });

      base.http.delete(url, options)
        .map(res => res.json())
        .subscribe(function (success) {
          resolve(success);
        }, function (error) {
          reject(error);
        });
    });
  }


  /** get requests **/
  public get(url: string) {
    let base = this;
    return new Promise(function (resolve, reject) {
      let headers = new Headers();
      headers.append('content-type', 'application/json');
      // headers.append('X-DreamFactory-API-Key', base.apiKey);

      let options = new RequestOptions({ headers: headers });

      base.http.get(url, options)
        .map(res => res.json())
        .subscribe(function (success) {
          resolve(success);
        }, function (error) {
          reject(error);
        });
    });
  }

  /** post requests **/
  public post(url: string, data: any) {
    let base = this;
    return new Promise(function (resolve, reject) {
      let headers = new Headers();
      headers.append('content-type', 'application/json');
      //fdhsjkal;
      // headers.append('X-DreamFactory-API-Key', base.apiKey);
      let postData: any = data;
      let options = new RequestOptions({ headers: headers });
      base.http.post(url, postData,options)
        .map(res => res.json())
        .subscribe(function (success) {
          resolve(success);
        }, function (error) {
          reject(error);
        });

    });
  }

    /** post requests **/
    public postForm(url: string, data: any) {
      let base = this;
      let headers = new Headers();
      headers.append('content-type', 'multipart/form-data');
      return new Promise(function (resolve, reject) {
    
        //fdhsjkal;
        // headers.append('X-DreamFactory-API-Key', base.apiKey);
        let postData: any = data;
        let options = new RequestOptions({ headers: headers });
        base.http.post(url, postData,options)
          .map(res => res.json())
          .subscribe(function (success) {
            resolve(success);
          }, function (error) {
            reject(error);
          });
  
      });
    }
  

  /** put request **/
  public put(url: string, data: any) {
    let base = this;
    return new Promise(function (resolve, reject) {
      let headers = new Headers();
      headers.append('content-type', 'application/json');
      // headers.append('X-DreamFactory-API-Key', base.apiKey);

      let options = new RequestOptions({ headers: headers });
      base.http.put(url, data, options)
        .map(res => res.json())
        .subscribe(function (success) {
          resolve(success);
        }, function (error) {
          reject(error);
        });

    });
  }
}
