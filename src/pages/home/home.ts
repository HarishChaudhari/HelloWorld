import { Component } from '@angular/core';
import 'rxjs/Rx';
import { APIHelperService } from "../../app/apihelper.service";
import { Expense } from "../../app/expense";
import { NavController, AlertController, LoadingController, MenuController } from 'ionic-angular';
import { SettingsPage } from '../settings/settings';
import { Storage } from '@ionic/storage';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  successMsg = '';  
  settingsPage = SettingsPage;
  Expense = new Expense();
  loading = this.loadingCtrl.create({
    content: 'Please wait...'
  });

  constructor(public navCtrl: NavController, 
    public menuCtrl: MenuController,
    private APIHelperService: APIHelperService, 
    private alertCtrl: AlertController,
    private loadingCtrl: LoadingController,
    public storage: Storage) {
      this.setDefaultValues();
    }

  setDefaultValues(){
    this.Expense.Date = '';
    this.Expense.Title = '';
    this.Expense.Category = '';
    this.storage.get('FIRST_NAME').then((fname) => {
        this.Expense.ByWhom = fname;
    });
    this.Expense.Amount = '';
    this.Expense.Details = '';
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
        console.log('failed login')
      }
    );
  }

  presentAlert() {
    let alert = this.alertCtrl.create({
      title: 'Done!',
      subTitle: this.successMsg,
      buttons: ['Close']
    });
    alert.present();
  }

  openMenu() {
    this.menuCtrl.open();
  }
  closeMenu() {
    this.menuCtrl.close();
  }
}