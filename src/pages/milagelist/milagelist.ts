import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Platform } from 'ionic-angular';
import { LoginsignupProvider } from '../../providers/loginsignup/loginsignup';
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
pdfMake.vfs = pdfFonts.pdfMake.vfs;
import { FileOpener } from '@ionic-native/file-opener';
import { File } from '@ionic-native/file';

/**
 * Generated class for the MilagelistPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-milagelist',
  templateUrl: 'milagelist.html',
})
export class MilagelistPage {
  public milagelist = [];
  address:any;
  letterObj = {
    to: 'Foster',
    from: 'Subham',
    text: 'This pdf make test'
  }



  pdfObj = null;
  data: any;


  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public loginsignpro: LoginsignupProvider,
    private plt: Platform,
    private file: File,
    private fileOpener: FileOpener) {
    this.getMilageList();
    this.data = this.navParams.get('data');
    console.log(this.data)
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad MilagelistPage');
    this.getprofiledata()
  }

  getprofiledata() {
    let _base = this;
    this.loginsignpro.getProfile(localStorage.getItem("userId")).then(function (success: any) {
      console.log(success);
      if (success) {
        _base.address = success.result;

      }
    }, function (err) {
      console.log(err);
    })
  }

  getMilageList() {
    let _base = this;
    this.loginsignpro.getmilage(localStorage.getItem("userId")).then(function (success: any) {
      console.log(success);
      _base.milagelist = success.result.records;
    }, function (err) {
      console.log(err);
    })

  }

  buildTableBody(data, columns) {
    var body = [];

    body.push(columns);

    data.forEach(function (row) {
      var dataRow = [];

      columns.forEach(function (column) {
        dataRow.push(row[column.text]);
      })

      body.push(dataRow);
    });

    return body;
  }

  table(data, columns) {

    return {
      // layout: 'lightHorizontalLines',

      table: {
        headerRows: 1,
        widths: ['*', '*', '*', '*'],
        fontSize: 11,
        body: this.buildTableBody(data, columns)
      }
    };
  }
  formatdata(datee) {
    var today = datee;
    var dd = today.getDate();
    var mm = today.getMonth() + 1;

    var yyyy = today.getFullYear();
    if (dd < 10) {
      dd = 0 + dd;
    }
    if (mm < 10) {
      mm = 0 + mm;
    }
    return dd + '-' + mm + '-' + yyyy;


  }

  createPdf() {

    var title = '';
    // this.data.date.end=this.data.date.end
    var externalDataRetrievedFromServer = [];
    if (this.data.data.business) {
      externalDataRetrievedFromServer = this.data.data.business;
      title = 'Business'
    }
    else if (this.data.data.personal) {
      externalDataRetrievedFromServer = this.data.data.personal;
      title = "Personal"
    }
    else {
      externalDataRetrievedFromServer = this.data.data;
      title = "Business & Personal"
    }
    console.log(externalDataRetrievedFromServer)
    var today = new Date();

    var dynamicttile = [];
    if (this.data.type == 'time') {
      dynamicttile = [{ text: 'title', bold: true }, { text: 'recordType', bold: true },{ text: 'startTime', bold: true },{ text: 'endTime', bold: true }];
    }
    else if (this.data.type == 'milage') {
      dynamicttile = [{ text: 'title', bold: true }, { text: 'recordType', bold: true },{ text: 'startLocation', bold: true },{ text: 'endLocation', bold: true }];

    }
    
    var docDefinition = {


      content: [

        {
          image: 'data:image/png;base64,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',
          width: 35,
          height: 35
        },
        { text: 'TapTap', style: 'header', fontSize: 13 },

        { text: this.formatdata(today), alignment: 'right', margin: [0, 0, 0, 0], fontSize: 13 },


        { text: this.address.name, bold: true, fontSize: 13 },
        { text: this.address.address, fontSize: 11 },
      
        { text: 'UID: ' + localStorage.getItem('uid'), bold: true, fontSize: 11, margin: [0, 5, 0, 0] },
        { text: 'Start Date:-' + this.data.date.start + ' & ' + 'End Date:-' + this.data.date.end, style: 'jj', fontSize: 11, margin: [0, 5, 0, 0], alignment: 'center' },

        { text: title, bold: true, alignment: 'center', fontSize: 13, margin: [20, 10, 10, 10] },

        this.table(externalDataRetrievedFromServer, dynamicttile),
        { text: "Gocube Technology Limited", bold: true, fontSize: 13 ,margin:[0 ,30 ,0 ,0]},
        { text: "Company No: 111444", bold: true, fontSize: 13 },
        { text: "Future Business Centre, Kings Hedges Road,",  fontSize: 12 },
        { text: "Cambridge, England, CB4 2HY",  fontSize: 12 },

        

      ],
      styles: {
        header: {
          fontSize: 18,
          bold: true,
        },
        subheader: {
          fontSize: 14,
          bold: true,
          margin: [0, 15, 0, 0]
        },
        jj: {
          fontSize: 14,
          bold: true,
          margin: [20, 0, 0, 0]
        },

        jjj: {
          fontSize: 14,
          'listStyle': 'none'
        },
        story: {
          italic: true,
          alignment: 'center',
          width: '50%',
        }
      }
    }
    console.log("creating");
    this.pdfObj = pdfMake.createPdf(docDefinition);
  }

  downloadPdf() {
    if (this.plt.is('cordova')) {
      this.pdfObj.getBuffer((buffer) => {
        var blob = new Blob([buffer], { type: 'application/pdf' });

        // Save the PDF to the data Directory of our App
        this.file.writeFile(this.file.dataDirectory, 'myletter.pdf', blob, { replace: true }).then(fileEntry => {
          // Open the PDf with the correct OS tools
          this.fileOpener.open(this.file.dataDirectory + 'myletter.pdf', 'application/pdf');
          console.log("open");
        })
      });
    } else {
      // On a browser simply use download!
      this.pdfObj.download();
    }
  }
  back() {
    this.navCtrl.pop();
  }
}
