import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable()

export class ThirdPartyAPIService {

  constructor(private http: HttpClient) { }

  setBetSettlement(bets: any) {
    return this.http.post(environment.NODE_API+`api/admin/settle-bet`, bets);
    //return this.http.post('http://18.142.111.240:8080/api/admin/settle-bet', bets);
  }

}
