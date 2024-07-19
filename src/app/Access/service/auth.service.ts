import { HttpClient,HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment.development';
 
@Injectable({
  providedIn: 'root'
})
 
export class AuthService {

  constructor(private http: HttpClient) { }


  GetAccessMenu(user:string , menuPere:string) {
    return this.http.get(`${environment.API_BASE_URL_ACCESS}vaccessmenuusers/findByUser?user=`+user+`&menuPere=`+menuPere );
  }
}
