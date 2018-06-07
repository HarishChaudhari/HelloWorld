import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController } from 'ionic-angular';
import { Expense } from '../../app/expense';
import { APIHelperService } from '../../app/apihelper.service';
import { Storage } from '@ionic/storage';

/**
 * Generated class for the ReportPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-report',
  templateUrl: 'report.html',
})
export class ReportPage {
  report_month: any;
  sum = 0;
  totalExpense = '';
  reportTitle = ''
  isNoData = false;
  sheetData = new Array({  
    Date : '',
    Title : '',
    Category : '',
    Amount : '',
    ByWhom : '',
    Details : ''
  });

  loading: any;

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    private loadingCtrl: LoadingController,
    private APIHelperService: APIHelperService,
    public storage: Storage
    ) { 
    }

  ionViewDidLoad() {
  }

  ionViewWillEnter() {
    this.navigateReport(null);
  }

  navigateReport(dir){
    if(dir == 'prev'){
      this.storage.get('REPORT_MONTH').then((month) => {
        this.report_month = month;
        this.report_month = parseInt(this.report_month) - 1;
        if( this.report_month < 1 ) {
          this.report_month = 12;
        }
        this.getSheetData(this.report_month);
      });
    } else if(dir == 'next'){
      this.storage.get('REPORT_MONTH').then((month) => {
        this.report_month = month;
        this.report_month = parseInt(this.report_month) + 1;
        if( this.report_month > 12 ) {
          this.report_month = 1;
        }
        this.getSheetData(this.report_month);
      });
    } else {
      this.report_month = String(new Date().getMonth() + 1);
      this.getSheetData(this.report_month);
    }
  }

  getSheetData(SHEET_NAME){
    this.storage.set('REPORT_MONTH', SHEET_NAME);
    this.presentLoading();

    const monthNames = ["January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December"
    ];
    this.reportTitle = monthNames[SHEET_NAME-1] + ' ' + new Date().getFullYear();
    this.APIHelperService.getExpenseDataFromGoogleSheets(SHEET_NAME).subscribe(
      response => { 
        // User authenticated succesfuly
        if(typeof response == 'object' && response.length > 1 ) {
          this.isNoData = false;
          this.sheetData = new Array();
          this.sum = 0;
          this.loading.dismiss();
          for (var i =1; i <= response.length-1; i++) {
            var sheetDataRow = new Expense();
            var row = response[i];
            this.sum = this.sum + row[3];

            sheetDataRow.index = i;
            sheetDataRow.Date = new Date(row[0]).toLocaleDateString();
            sheetDataRow.Title = row[1];
            sheetDataRow.Category = row[2];
            sheetDataRow.Amount = row[3].toLocaleString();
            sheetDataRow.ByWhom = row[4];
            sheetDataRow.Details = row[5];
            
            this.totalExpense = this.sum.toLocaleString();
            this.sheetData.push(sheetDataRow);
          }
        } else {
          this.sheetData = new Array();
          this.totalExpense = '0';
          this.loading.dismiss();
          this.isNoData = true;
        }
      },
      err => {
        console.log('failed login')
      }
    );
  }

  presentLoading(){
    this.loading = this.loadingCtrl.create({
      content: 'Please wait...'
    });

    this.loading.present();
  }
}