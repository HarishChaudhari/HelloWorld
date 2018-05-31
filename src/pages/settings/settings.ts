import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, AlertController } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { Settings } from '../../app/settings';

/**
 * Generated class for the SettingsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-settings',
  templateUrl: 'settings.html',
})
export class SettingsPage {
  
  successMsg = 'Settings saved.';
  settings = new Settings();
  loading = this.loadingCtrl.create({
    content: 'Please wait...'
  });
  
  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public storage: Storage,
    private alertCtrl: AlertController,
    private loadingCtrl: LoadingController
    ) { }

  onSubmit(settingsData) {
    this.updateSetting(settingsData);
    return false;
  }

  updateSetting(settingsData){
    this.loading.present();
    this.storage.set('API_ENDPOINT', settingsData.url);
    this.storage.set('FIRST_NAME', settingsData.fname);
    this.settings.url = settingsData.url;
    this.settings.fname = settingsData.fname;
    this.loading.dismiss();
    this.presentAlert();
  }

  ionViewDidLoad() { }

  ionViewCanEnter(){
      this.storage.get('API_ENDPOINT').then((url) => {
        this.settings.url = url;
      });
      this.storage.get('FIRST_NAME').then((fname) => {
        this.settings.fname = fname;
      });
  }

  presentAlert() {
    let alert = this.alertCtrl.create({
      title: 'Done!',
      subTitle: this.successMsg,
      buttons: ['Close']
    });
    alert.present();
  }
}