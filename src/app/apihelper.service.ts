import {Injectable} from '@angular/core';
import {Http, Response} from "@angular/http";

@Injectable()
export class APIHelperService {
    public static API_ENDPOINT='https://script.google.com/macros/s/AKfycby_xCtdMR3wkB--rh9elwl6sjK_CZ5AhJ4t624Z1SvBnOjH-Ibj/exec';
   
    constructor( private http:Http) { }

    // Uses http.get() to load a single JSON file

    public submitExpenseDataToGoogleSheets(expenseData){
        /*var headers = new Headers({ 
            'Content-Type': 'application/json'
        });
        var options = new RequestOptions({headers: headers });
        */
        return this.http.post(APIHelperService.API_ENDPOINT, JSON.stringify(expenseData)).map(this.extractData);
    }
    private extractData(res: Response) {        
        return res.text() ? res.json() : {}; ;
    }
}