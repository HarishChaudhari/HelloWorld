import { Component } from '@angular/core';
import 'rxjs/Rx';
import { APIHelperService } from "../../app/apihelper.service";
import { Expense } from "../../app/expense";
import { NavController, AlertController, LoadingController } from 'ionic-angular';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  isFailed = false;
  isSpinner = false;
  successMsg = '';  
  Expense = new Expense("","","Select","","","");
  loading = this.loadingCtrl.create({
    content: 'Please wait...'
  });

  constructor(public navCtrl: NavController, 
    private APIHelperService: APIHelperService, 
    private alertCtrl: AlertController,
    private loadingCtrl: LoadingController) {
    
  }

  onSubmit(expenseData) {
    this.submitData(expenseData);
    return false;
  }

  submitData(expenseData){
    this.loading.present();
    this.APIHelperService.submitExpenseDataToGoogleSheets(expenseData).subscribe(
      response => { 
        // User authenticated succesfuly
        if(typeof response == 'object' && response.result == 'success' ) {
          this.loading.dismiss();
          this.successMsg = 'Expense added to sheet.'

          this.presentAlert();
          //this.router.navigate(["/home"]);
        }
      },
      err => {
        this.isFailed = true;
        console.log('failed login')
      }
    );
  }

  presentAlert() {
    let alert = this.alertCtrl.create({
      title: 'Done!',
      subTitle: this.successMsg,
      buttons: ['Dismiss']
    });
    alert.present();
  }
}