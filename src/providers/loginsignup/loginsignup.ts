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
  public apiUrl: string = "https://api.taptap.org.uk/";
  // public apiUrl:string="https://api.taptap.org.uk/user/";
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

  //API call for otp verification...
  forgotPassword(data) {
    let _base = this;
    return new Promise(function (resolve, reject) {
      // console.log("url==============>>>>>>>>>>"+ _base.apiUrl + '/register?'+'username='+userName+'&email='+email+'&phone='+phoneNumber+'&password='+password);
      _base.http.put(_base.apiUrl + 'user/forgotPassword', data)
        .then(function (success) {
          resolve(success);
        }, function (error) {
          reject(error);
        });
    });
  }

  //API call for otp verification...
  verifyUserOTP(data) {
    let _base = this;
    return new Promise(function (resolve, reject) {
      // console.log("url==============>>>>>>>>>>"+ _base.apiUrl + '/register?'+'username='+userName+'&email='+email+'&phone='+phoneNumber+'&password='+password);
      _base.http.put(_base.apiUrl + 'user/otpVerification', data)
        .then(function (success) {
          resolve(success);
        }, function (error) {
          reject(error);
        });
    });
  }

  verifyEmailOTP(data) {
    let _base = this;
    return new Promise(function (resolve, reject) {
      // console.log("url==============>>>>>>>>>>"+ _base.apiUrl + '/register?'+'username='+userName+'&email='+email+'&phone='+phoneNumber+'&password='+password);
      _base.http.put(_base.apiUrl + 'user/emailVerify', data)
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

  // resetPassword
  favourite(data) {
    let _base = this;
    return new Promise(function (resolve, reject) {
      // console.log("url==============>>>>>>>>>>"+ _base.apiUrl + '/register?'+'username='+userName+'&email='+email+'&phone='+phoneNumber+'&password='+password);
      _base.http.put(_base.apiUrl + 'tapped/update', data)
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

  getusermonthlytaps(userid: String, month: String, str: String) {
    let _base = this;
    return new Promise(function (resolve, reject) {
      // console.log("url==============>>>>>>>>>>"+ _base.apiUrl + '/register?'+'username='+userName+'&email='+email+'&phone='+phoneNumber+'&password='+password);
      _base.http.get(_base.apiUrl + 'tapped/searchtaps?userId=' + userid + "&date=" + month + "&string=" + str)
        .then(function (success) {
          resolve(success);
        }, function (error) {
          reject(error);
        });
    });
  }

  searchfavourite(userid: String, month: String, str: String) {
    let _base = this;
    return new Promise(function (resolve, reject) {
      // console.log("url==============>>>>>>>>>>"+ _base.apiUrl + '/register?'+'username='+userName+'&email='+email+'&phone='+phoneNumber+'&password='+password);
      _base.http.get(_base.apiUrl + 'tapped/searchfavourites?userId=' + userid + "&date=" + month + "&string=" + str)
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
      case 'Verification':
        route = 'verification';
        prefix = 'verification';
        break;
      case 'Restaurant':
        route = 'restaurant';
        prefix = 'restaurant';
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


  getProductAdminCategory(category: String, adminId: String) {
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
      case 'Verification':
        route = 'verification';
        prefix = 'verification';
        break;
      case 'Restaurant':
        route = 'restaurant';
        prefix = 'restaurant';
        break;
      default:
      // code block
    }

    return new Promise(function (resolve, reject) {
      _base.http.get(_base.apiUrl + route + '/get' + prefix + 'byAdmin?adminId=' + adminId)
        .then(function (success) {
          resolve(success);
        }, function (error) {
          reject(error);
        });
    });
  }



  // select  for pdf generation

  selectdate(userid: String, url, sdate, edate) {
    let _base = this;
    console.log(_base.apiUrl + url + userid + '&startDate=' + sdate + '&endDate=' + edate);
    return new Promise(function (resolve, reject) {
      _base.http.get(_base.apiUrl + url + userid + '&startDate=' + sdate + '&endDate=' + edate)
        .then(function (success) {
          resolve(success);
        }, function (error) {
          reject(error);
        });
    });
  }


  getuserslist() {
    let _base = this;
    return new Promise(function (resolve, reject) {
      // console.log("url==============>>>>>>>>>>"+ _base.apiUrl + '/register?'+'username='+userName+'&email='+email+'&phone='+phoneNumber+'&password='+password);
      _base.http.get(_base.apiUrl + 'user/userlist')
        .then(function (success) {
          resolve(success);
        }, function (error) {
          reject(error);
        });
    });
  }

  // get all feeds list
  getAllFeedsList(userId: String) {
    let _base = this;
    return new Promise(function (resolve, reject) {
      _base.http.get(_base.apiUrl + 'feeds/userfeed?userId=' + userId)
        .then(function (success) {
          resolve(success);
        }, function (error) {
          reject(error);
        });
    })
  }

  getFeedsByCategory(categoryId: String) {
    // feeds/allbycategory?categoryId=
    let _base = this;
    return new Promise(function (resolve, reject) {
      _base.http.get(_base.apiUrl + 'feeds/allbycategory?categoryId=' + categoryId)
        .then(function (success) {
          resolve(success);
        }, function (error) {
          reject(error);
        });
    })
  }

  reactionOnFeed(reaction: any) {
    let _base = this;
    return new Promise(function (resolve, reject) {
      // console.log("url==============>>>>>>>>>>"+ _base.apiUrl + '/register?'+'username='+userName+'&email='+email+'&phone='+phoneNumber+'&password='+password);
      _base.http.post(_base.apiUrl + 'feeds/likeunlike', reaction)
        .then(function (success) {
          resolve(success);
        }, function (error) {
          reject(error);
        });
    });
  }

  userUpdateLocationOrSocket(userData: any) {
    let _base = this;
    return new Promise(function (resolve, reject) {
      // console.log("url==============>>>>>>>>>>"+ _base.apiUrl + '/register?'+'username='+userName+'&email='+email+'&phone='+phoneNumber+'&password='+password);
      _base.http.put(_base.apiUrl + 'user/location_socket', userData)
        .then(function (success) {
          resolve(success);
        }, function (error) {
          reject(error);
        });
    });
  }

  getMyFeeds(feedQuery: any) {

    let _base = this;
    return new Promise(function (resolve, reject) {
      _base.http.post(_base.apiUrl + 'feeds/filters', feedQuery)
        .then(function (success) {
          resolve(success);
        }, function (error) {
          reject(error);
        });
    });
  }

  // get all categories
  getallcategories() {
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

  //short url link
  shortlink(link) {
    let _base = this;
    return new Promise(function (resolve, reject) {
      // console.log("url==============>>>>>>>>>>"+ _base.apiUrl + '/register?'+'username='+userName+'&email='+email+'&phone='+phoneNumber+'&password='+password);
      _base.http.post(_base.apiUrl + 'user/shorten_url', link)
        .then(function (success) {
          resolve(success);
        }, function (error) {
          reject(error);
        });
    });
  }




  // to correct things
  individualprofile(link){
    let _base = this;
    return new Promise(function (resolve, reject) {
      // console.log("url==============>>>>>>>>>>"+ _base.apiUrl + '/register?'+'username='+userName+'&email='+email+'&phone='+phoneNumber+'&password='+password);
      _base.http.post(_base.apiUrl + 'user/shorten_url', link)
        .then(function (success) {
          resolve(success);
        }, function (error) {
          reject(error);
        });
    });
  }
  resendOtp(link){
    let _base = this;
    return new Promise(function (resolve, reject) {
      // console.log("url==============>>>>>>>>>>"+ _base.apiUrl + '/register?'+'username='+userName+'&email='+email+'&phone='+phoneNumber+'&password='+password);
      _base.http.post(_base.apiUrl + 'user/shorten_url', link)
        .then(function (success) {
          resolve(success);
        }, function (error) {
          reject(error);
        });
    });
  }
  

}
