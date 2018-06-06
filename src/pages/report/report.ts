import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController } from 'ionic-angular';
import { Expense } from '../../app/expense';
import { APIHelperService } from '../../app/apihelper.service';

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
  //sheetData = new Array;
  sum = 0;
  totalExpense = '';
  reportTitle = ''
  sheetData = new Array({  
    Date : '',
    Title : '',
    Category : '',
    Amount : '',
    ByWhom : '',
    Details : ''
  });

  loading = this.loadingCtrl.create({
    content: 'Please wait...'
  });
  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    private loadingCtrl: LoadingController,
    private APIHelperService: APIHelperService
    ) { 
    }

  ionViewDidLoad() {
  }

  ionViewWillEnter() {
    this.loading.present();
    const monthNames = ["January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December"
    ];
    this.reportTitle = monthNames[new Date().getMonth()] + ' ' + new Date().getFullYear();
    this.APIHelperService.getExpenseDataFromGoogleSheets().subscribe(
      response => { 
        // User authenticated succesfuly
        if(typeof response == 'object' ) {
          this.sheetData = new Array();
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
        }
      },
      err => {
        console.log('failed login')
      }
    );
  }
}