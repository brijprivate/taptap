import { HttpHeaders, HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { HttpProvider } from '../http/http';

/*
  Generated class for the NfctagProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class NfctagProvider {

  public apiUrl: string = "https://api.taptap.org.uk/";

  constructor(public http: HttpProvider, public httpOne: HttpClient) {
    console.log('Hello NfctagProvider Provider');
  }

  //API call for pair device...
  pairDevice(data) {
    let _base = this;
    return new Promise(function (resolve, reject) {
      // console.log("url==============>>>>>>>>>>"+ _base.apiUrl + '/register?'+'username='+userName+'&email='+email+'&phone='+phoneNumber+'&password='+password);
      _base.http.put(_base.apiUrl + 'device/pairdevice', data)
        .then(function (success) {
          resolve(success);
        }, function (error) {
          reject(error);
        });
    });
  }

  //API call for pair device...
  getpairdevice(data) {
    let _base = this;
    return new Promise(function (resolve, reject) {
      // console.log("url==============>>>>>>>>>>"+ _base.apiUrl + '/register?'+'username='+userName+'&email='+email+'&phone='+phoneNumber+'&password='+password);
      _base.http.get(_base.apiUrl + 'device/pairedList?owner=' + data)
        .then(function (success) {
          resolve(success);
        }, function (error) {
          reject(error);
        });
    });
  }

  //API call for pair device...
  verifyDevice(data) {
    console.log(data);
    let _base = this;
    return new Promise(function (resolve, reject) {
      // console.log("url==============>>>>>>>>>>"+ _base.apiUrl + '/register?'+'username='+userName+'&email='+email+'&phone='+phoneNumber+'&password='+password);
      _base.http.get(_base.apiUrl + 'device/verifyuser?owner=' + data.userid + '&' + 'nfc_id=' + data.nfcId)
        .then(function (success) {
          resolve(success);
        }, function (error) {
          reject(error);
        });
    });
  }

  //API call for record time...
  recordTime(data) {
    let _base = this;
    return new Promise(function (resolve, reject) {
      // console.log("url==============>>>>>>>>>>"+ _base.apiUrl + '/register?'+'username='+userName+'&email='+email+'&phone='+phoneNumber+'&password='+password);
      _base.http.post(_base.apiUrl + 'time/recordTime', data)
        .then(function (success) {
          resolve(success);
        }, function (error) {
          reject(error);
        });
    });
  }

  //API call for tap item...
  createTap(data) {
    let _base = this;
    return new Promise(function (resolve, reject) {
      // console.log("url==============>>>>>>>>>>"+ _base.apiUrl + '/register?'+'username='+userName+'&email='+email+'&phone='+phoneNumber+'&password='+password);
      _base.http.post(_base.apiUrl + 'tapped/create', data)
        .then(function (success) {
          resolve(success);
        }, function (error) {
          reject(error);
        });
    });
  }

  //API call for tap item...
  createMilage(data) {
    let _base = this;
    return new Promise(function (resolve, reject) {
      // console.log("url==============>>>>>>>>>>"+ _base.apiUrl + '/register?'+'username='+userName+'&email='+email+'&phone='+phoneNumber+'&password='+password);
      _base.http.post(_base.apiUrl + 'milage/recordMilage', data)
        .then(function (success) {
          resolve(success);
        }, function (error) {
          reject(error);
        });
    });
  }

  //create favourite....
  createFav(data) {
    let _base = this;
    return new Promise(function (resolve, reject) {
      // console.log("url==============>>>>>>>>>>"+ _base.apiUrl + '/register?'+'username='+userName+'&email='+email+'&phone='+phoneNumber+'&password='+password);
      _base.http.post(_base.apiUrl + 'favourite/addFavourite', data)
        .then(function (success) {
          resolve(success);
        }, function (error) {
          reject(error);
        });
    });
  }

  //API call for update product ...
  favUpdate(data) {
    console.log('data in service', data);
    let _base = this;
    return new Promise(function (resolve, reject) {
      console.log(_base.apiUrl + 'tapped/update', data)
      _base.http.put(_base.apiUrl + 'tapped/update', data)
        .then(function (success) {
          resolve(success);
        }, function (error) {
          reject(error);
        });
    });
  }
  //API get product by id...
  getproductbyide(data) {
    console.log(data);
    let _base = this;
    return new Promise(function (resolve, reject) {
      // console.log("url==============>>>>>>>>>>"+ _base.apiUrl + '/register?'+'username='+userName+'&email='+email+'&phone='+phoneNumber+'&password='+password);
      _base.http.get(_base.apiUrl + 'product/productbyId?id=' + data)
        .then(function (success) {
          resolve(success);
        }, function (error) {
          reject(error);
        });
    });
  }

  //API get product by id...
  getbusinesses(userID: String) {
    let _base = this;
    return new Promise(function (resolve, reject) {
      // console.log("url==============>>>>>>>>>>"+ _base.apiUrl + '/register?'+'username='+userName+'&email='+email+'&phone='+phoneNumber+'&password='+password);
      _base.http.get(_base.apiUrl + 'business/businessByUserId?userId=' + userID)
        .then(function (success) {
          resolve(success);
        }, function (error) {
          reject(error);
        });
    });
  }

  updatePermission(permission) {
    let _base = this;
    return new Promise(function (resolve, reject) {
      _base.http.put(_base.apiUrl + 'business/updateinvite', permission)
        .then(function (success) {
          resolve(success);
        }, function (error) {
          reject(error);
        });
    });
  }

  // rejectInvitstion() {
  //   let _base = this;
  //   return new Promise(function (resolve, reject) {
  //     _base.http.put(_base.apiUrl + 'business/updateinvite', permission)
  //       .then(function (success) {
  //         resolve(success);
  //       }, function (error) {
  //         reject(error);
  //       });
  //   });
  // }

  //API get product by id...
  getnotifications(userID: String) {
    let _base = this;
    return new Promise(function (resolve, reject) {
      // console.log("url==============>>>>>>>>>>"+ _base.apiUrl + '/register?'+'username='+userName+'&email='+email+'&phone='+phoneNumber+'&password='+password);
      _base.http.get(_base.apiUrl + 'notifications/list?userId=' + userID)
        .then(function (success) {
          resolve(success);
        }, function (error) {
          reject(error);
        });
    });
  }

  viewNotification(notificationId: String) {
    let data = {
      feedId: notificationId
    }
    let _base = this;
    return new Promise(function (resolve, reject) {
      _base.http.put(_base.apiUrl + 'notifications/update', data)
        .then(function (success) {
          resolve(success);
        }, function (error) {
          reject(error);
        });
    });
  }

  updateDeviceName(data) {

    let _base = this;
    return new Promise(function (resolve, reject) {
      _base.http.put(_base.apiUrl + 'device/updateDeviceInfo', data)
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


  deletedevice(nfcid) {

    // return this.http.put(this.apiUrl+'device/removeOwner?nfc_id=', nfcid);
    let _base = this;
    return new Promise(function (resolve, reject) {
      console.log(_base.apiUrl + 'device/removeOwner?nfc_id=' + nfcid)
      _base.http.put(_base.apiUrl + 'device/removeOwner?nfc_id=' + nfcid, {})
        .then(function (success) {
          resolve(success);
        }, function (error) {
          reject(error);
        });
    });
  }

  // resetPassword
  removebusiness(data) {
    let _base = this;
    return new Promise(function (resolve, reject) {
      // console.log("url==============>>>>>>>>>>"+ _base.apiUrl + '/register?'+'username='+userName+'&email='+email+'&phone='+phoneNumber+'&password='+password);
      _base.http.put(_base.apiUrl + 'business/removebusiness', data)
        .then(function (success) {
          resolve(success);
        }, function (error) {
          reject(error);
        });
    });
  }

  //get milage...
  getmilage(userid: String) {
    let _base = this;
    return new Promise(function (resolve, reject) {
      // console.log("url==============>>>>>>>>>>"+ _base.apiUrl + '/register?'+'username='+userName+'&email='+email+'&phone='+phoneNumber+'&password='+password);
      _base.http.get(_base.apiUrl + 'milage/usermilage?userId=' + userid)
        .then(function (success) {
          resolve(success);
        }, function (error) {
          reject(error);
        });
    });
  }


  //get milage...
  getfeeds(categoryId: String) {
    let _base = this;

    let url = _base.apiUrl + 'feeds/allbycategory'
    if (categoryId != null) {
      url = url + '?categoryId=' + categoryId
    }

    return new Promise(function (resolve, reject) {
      // console.log("url==============>>>>>>>>>>"+ _base.apiUrl + '/register?'+'username='+userName+'&email='+email+'&phone='+phoneNumber+'&password='+password);
      _base.http.get(url)
        .then(function (success) {
          resolve(success);
        }, function (error) {
          reject(error);
        });
    });
  }

  //get milage...
  getcategories() {
    let _base = this;
    return new Promise(function (resolve, reject) {
      // console.log("url==============>>>>>>>>>>"+ _base.apiUrl + '/register?'+'username='+userName+'&email='+email+'&phone='+phoneNumber+'&password='+password);
      _base.http.get(_base.apiUrl + 'category/allcategory')
        .then(function (success) {
          resolve(success);
        }, function (error) {
          reject(error);
        });
    });
  }

  //get milage...
  gettime(userid: String) {
    let _base = this;
    return new Promise(function (resolve, reject) {
      // console.log("url==============>>>>>>>>>>"+ _base.apiUrl + '/register?'+'username='+userName+'&email='+email+'&phone='+phoneNumber+'&password='+password);
      _base.http.get(_base.apiUrl + 'time/usertime?userId=' + userid)
        .then(function (success) {
          resolve(success);
        }, function (error) {
          reject(error);
        });
    });
  }

  //get count of milage and time....
  //get milage...
  getcount(userid: String) {
    let _base = this;
    return new Promise(function (resolve, reject) {
      // console.log("url==============>>>>>>>>>>"+ _base.apiUrl + '/register?'+'username='+userName+'&email='+email+'&phone='+phoneNumber+'&password='+password);
      _base.http.get(_base.apiUrl + 'milage/totalCount?userId=' + userid)
        .then(function (success) {
          resolve(success);
        }, function (error) {
          reject(error);
        });
    });
  }

  //get image....
  getimage(userid) {
    let _base = this;
    return new Promise(function (resolve, reject) {
      // console.log("url==============>>>>>>>>>>"+ _base.apiUrl + '/register?'+'username='+userName+'&email='+email+'&phone='+phoneNumber+'&password='+password);
      _base.http.get(_base.apiUrl + 'file/getImage?imageId=' + userid)
        .then(function (success) {
          resolve(success);
        }, function (error) {
          reject(error);
        });
    });
  }

  likefeed(feeddata) {

    let _base = this;
    return new Promise(function (resolve, reject) {
      _base.http.put(_base.apiUrl + 'feeds/like', feeddata)
        .then(function (success) {
          resolve(success);
        }, function (error) {
          reject(error);
        });
    });
  }

  dislikefeed(feeddata) {

    let _base = this;
    return new Promise(function (resolve, reject) {
      _base.http.put(_base.apiUrl + 'feeds/unlike', feeddata)
        .then(function (success) {
          resolve(success);
        }, function (error) {
          reject(error);
        });
    });
  }
}
