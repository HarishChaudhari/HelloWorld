import {Injectable } from '@angular/core';
import {Http, Response} from "@angular/http";
import { Storage } from '@ionic/storage';

@Injectable()
export class APIHelperService {
    apiURL = '';
    constructor( public http:Http, public storage: Storage) {
        this.storage.get('API_ENDPOINT').then((url) => {
            this.apiURL = url;
        });
     }

    // Uses http.get() to load a single JSON file
    submitExpenseDataToGoogleSheets(expenseData){
        /*var headers = new Headers({ 
            'Content-Type': 'application/json'
        });
        var options = new RequestOptions({headers: headers });
        */
        return this.http.post(this.apiURL, JSON.stringify(expenseData)).map(this.extractData);
    }
    getExpenseDataFromGoogleSheets(){
        return this.http.get(this.apiURL).map(this.extractData);
    }
    extractData(res: Response) {        
        return res.text() ? res.json() : {}; ;
    }
}