import { HttpHeaders, HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { HttpProvider } from '../http/http';

/*
  Generated class for the LogregProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class LoginsignupProvider {
  public apiUrl: string = "http://ec2-18-225-10-142.us-east-2.compute.amazonaws.com:5450/";
  // public apiUrl:string="http://ec2-18-225-10-142.us-east-2.compute.amazonaws.com:5450/user/";
  public proxyurl: string = "https://cors-anywhere.herokuapp.com/";

  constructor(public http: HttpProvider, public httpOne: HttpClient) {
    console.log('Hello LogregProvider Provider');
  }


  //API call for signup...
  register(data) {
    let _base = this;
    return new Promise(function (resolve, reject) {
      // console.log("url==============>>>>>>>>>>"+ _base.apiUrl + '/register?'+'username='+userName+'&email='+email+'&phone='+phoneNumber+'&password='+password);
      _base.http.post(_base.apiUrl + 'user/sendcode', data)
        .then(function (success) {
          resolve(success);
        }, function (error) {
          reject(error);
        });
    });
  }

  //API call for otp verification...
  verifyotp(data) {
    let _base = this;
    return new Promise(function (resolve, reject) {
      // console.log("url==============>>>>>>>>>>"+ _base.apiUrl + '/register?'+'username='+userName+'&email='+email+'&phone='+phoneNumber+'&password='+password);
      _base.http.post(_base.apiUrl + 'user/registration', data)
        .then(function (success) {
          resolve(success);
        }, function (error) {
          reject(error);
        });
    });
  }

  //API call for Login...
  login(data) {
    let _base = this;
    return new Promise(function (resolve, reject) {
      // console.log("url==============>>>>>>>>>>"+ _base.apiUrl + '/register?'+'username='+userName+'&email='+email+'&phone='+phoneNumber+'&password='+password);
      _base.http.post(_base.apiUrl + 'user/login', data)
        .then(function (success) {
          resolve(success);
        }, function (error) {
          reject(error);
        });
    });
  }

  //API call for Facebook Login...
  fblogin(data) {
    let _base = this;
    return new Promise(function (resolve, reject) {
      // console.log("url==============>>>>>>>>>>"+ _base.apiUrl + '/register?'+'username='+userName+'&email='+email+'&phone='+phoneNumber+'&password='+password);
      _base.http.post(_base.apiUrl + 'user/socialRegistration', data)
        .then(function (success) {
          resolve(success);
        }, function (error) {
          reject(error);
        });
    });
  }

  //Get profile...

  getProfile(data) {
    let _base = this;
    return new Promise(function (resolve, reject) {
      // console.log("url==============>>>>>>>>>>"+ _base.apiUrl + '/register?'+'username='+userName+'&email='+email+'&phone='+phoneNumber+'&password='+password);
      _base.http.get(_base.apiUrl + 'user/profile?id=' + data)
        .then(function (success) {
          resolve(success);
        }, function (error) {
          reject(error);
        });
    });
  }

  getDashboard(data) {
    let _base = this;
    return new Promise(function (resolve, reject) {
      // console.log("url==============>>>>>>>>>>"+ _base.apiUrl + '/register?'+'username='+userName+'&email='+email+'&phone='+phoneNumber+'&password='+password);
      _base.http.get(_base.apiUrl + 'user/userDashboard?userId=' + data)
        .then(function (success) {
          resolve(success);
        }, function (error) {
          reject(error);
        });
    });
  }

  //Get tap data on present date....
  getTapPresentDate(data) {
    let _base = this;
    let cdate = new Date().toISOString();
    return new Promise(function (resolve, reject) {
      // console.log("url==============>>>>>>>>>>"+ _base.apiUrl + '/register?'+'username='+userName+'&email='+email+'&phone='+phoneNumber+'&password='+password);
      _base.http.get(_base.apiUrl + 'tapped/userdate?userId=' + data + '&' + 'date=' + cdate)
        .then(function (success) {
          resolve(success);
        }, function (error) {
          reject(error);
        });
    });
  }

  //Get list of all tapped item....
  getTapAll(data) {
    let _base = this;
    let cdate = new Date().toISOString();
    return new Promise(function (resolve, reject) {
      // console.log("url==============>>>>>>>>>>"+ _base.apiUrl + '/register?'+'username='+userName+'&email='+email+'&phone='+phoneNumber+'&password='+password);
      _base.http.get(_base.apiUrl + 'tapped/usertappedItems?userId=' + data)
        .then(function (success) {
          resolve(success);
        }, function (error) {
          reject(error);
        });
    });
  }

  //API call for update product ...
  profileUpdate(data) {
    console.log('data in service', data);
    let userId = localStorage.getItem("userId");
    let _base = this;
    return new Promise(function (resolve, reject) {
      console.log(_base.apiUrl + 'user/updateprofile?id=', data)
      _base.http.put(_base.apiUrl + 'user/updateprofile?id=' + userId, data)
        .then(function (success) {
          resolve(success);
        }, function (error) {
          reject(error);
        });
    });
  }

  // resetPassword
  resetpassword(data) {
    let _base = this;
    return new Promise(function (resolve, reject) {
      // console.log("url==============>>>>>>>>>>"+ _base.apiUrl + '/register?'+'username='+userName+'&email='+email+'&phone='+phoneNumber+'&password='+password);
      _base.http.put(_base.apiUrl + 'user/resetPassword', data)
        .then(function (success) {
          resolve(success);
        }, function (error) {
          reject(error);
        });
    });
  }

  //get list of milage...
  //Get list of all tapped item....
  getmilage(data) {
    let _base = this;
    let cdate = new Date().toISOString();
    return new Promise(function (resolve, reject) {
      // console.log("url==============>>>>>>>>>>"+ _base.apiUrl + '/register?'+'username='+userName+'&email='+email+'&phone='+phoneNumber+'&password='+password);
      _base.http.get(_base.apiUrl + 'milage/usermilage?userId=' + data)
        .then(function (success) {
          resolve(success);
        }, function (error) {
          reject(error);
        });
    });
  }

  getusermonthlytaps(userid: String, month: String) {
    let _base = this;
    return new Promise(function (resolve, reject) {
      // console.log("url==============>>>>>>>>>>"+ _base.apiUrl + '/register?'+'username='+userName+'&email='+email+'&phone='+phoneNumber+'&password='+password);
      _base.http.get(_base.apiUrl + 'tapped/usermonthly?userId=' + userid + "&month=" + month)
        .then(function (success) {
          resolve(success);
        }, function (error) {
          reject(error);
        });
    });
  }


  getProduct(category: String, productID: String) {
    let _base = this;

    console.log(category)

    let route = "";
    let prefix = "";

    switch (category) {
      case 'Business':
        route = 'business';
        prefix = 'business';
        break;
      case 'Contacts':
        route = 'contact';
        prefix = 'contact';
        break;
      case 'Sports':
        route = 'sports';
        prefix = 'sport';
        break;
      case 'Fashion':
        route = 'fashion';
        prefix = 'fashion';
        break;
      case 'General':
        route = 'general';
        prefix = 'general';
        break;
      case 'Event':
        route = 'events';
        prefix = 'event';
        break;
      case 'Groceries':
        route = 'groceries';
        prefix = 'groceries';
        break;
      default:
      // code block
    }

    return new Promise(function (resolve, reject) {
      _base.http.get(_base.apiUrl + route + '/get' + prefix + 'ById?id=' + productID)
        .then(function (success) {
          resolve(success);
        }, function (error) {
          reject(error);
        });
    });
  }

}
