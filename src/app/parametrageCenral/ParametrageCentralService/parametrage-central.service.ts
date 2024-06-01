import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment.development';
 
@Injectable({
  providedIn: 'root'
})
export class ParametrageCentralService {


  constructor(private http: HttpClient) { }

  // GetModRegActif(){
  //   return this.http.get(`${environment.API_BASE_URL}modereglement/actif?actif=true`);
  // }







  ///////////////

  GetFormControlName(desig:string){
    return this.http.get(`${environment.API_BASE_URL}FormControl/code?code=`+desig);
  }

  GetArticleActif(){
    return this.http.get(`${environment.API_BASE_URL}achat/article/actif?actif=true`);
  }
  GetFlActif(){
    return this.http.get(`${environment.API_BASE_URL}Filiale/actif?actif=true`);
  }

  // frs 
  GetFrsActif(){
    return this.http.get(`${environment.API_BASE_URL}achat/fournisseur/actif?actif=true`);
  }

  GetFrsByCode(code : number){
    return this.http.get(`${environment.API_BASE_URL}achat/fournisseur/`+code);
  }


  ///
  GetArticleBycode(code : number){

    return this.http.get(`${environment.API_BASE_URL}achat/article/`+code);
  }
  GetParams(code : string){
    
    return this.http.get(`${environment.API_BASE_URL}param/code?code=`+code);

  }
////////////////////////////////////////////////////////////////////////////////////
// DDE AHCAT 
  GetDdeAchatByCode(code : number){
    return this.http.get(`${environment.API_BASE_URL_ACHAT}dde_achat/`+code);
  }
  GetAllDdeAchat(){
    return this.http.get(`${environment.API_BASE_URL_ACHAT}dde_achat/all`);
  }
  PostDdeAchat(body : any){
    return this.http.post(`${environment.API_BASE_URL_ACHAT}dde_achat`,body);
  }
  PutDdeAchat(body : any){
    return this.http.put(`${environment.API_BASE_URL_ACHAT}dde_achat/update`,body);
  }
  DeleteDdeAchat(code : number){
    return this.http.delete(`${environment.API_BASE_URL_ACHAT}dde_achat/delete/`+code);
  }

 /////////////////////////////////////////////////////////////////////////////
//  DDE TRANSFERT 
GetDdeTransfertByCode(code : number){
  return this.http.get(`${environment.API_BASE_URL_ACHAT}dde_transfert/`+code);
}
GetAllDdeTransfert(){
  return this.http.get(`${environment.API_BASE_URL_ACHAT}dde_transfert/all`);
}
PostDdeTransfert(body : any){
  return this.http.post(`${environment.API_BASE_URL_ACHAT}dde_transfert`,body);
}
PutDdeTransfert(body : any){
  return this.http.put(`${environment.API_BASE_URL_ACHAT}dde_transfert/update`,body);
}
DeleteDdeTransfert(code : number){
  return this.http.delete(`${environment.API_BASE_URL}dde_transfert/delete/`+code);
}


//////// ModeReglement 

GetModeReglementActifAndIsPrincipal(){

  return this.http.get(`${environment.API_BASE_URL}achat/mode_reglement/actifAndIsPrincipal?actif=1&principal=1`);
}

// ordre achat 
GetOrdreAchatByCode(code : number){
  return this.http.get(`${environment.API_BASE_URL_ACHAT}ordre_achat/`+code);
}
GetAllOrdreAchat(){
  return this.http.get(`${environment.API_BASE_URL_ACHAT}ordre_achat/all`);
}
PostOrdreAchat(body : any){
  return this.http.post(`${environment.API_BASE_URL_ACHAT}ordre_achat`,body);
}
PutOrdreAchat(body : any){
  return this.http.put(`${environment.API_BASE_URL_ACHAT}ordre_achat/update`,body);
}
DeleteOrdreAchat(code : number){
  return this.http.delete(`${environment.API_BASE_URL_ACHAT}ordre_achat/delete/`+code);
}

GetDetailsOrdreAchatByCode(code : number){
  return this.http.get(`${environment.API_BASE_URL_ACHAT}details_ordre_achat/`+code);
}





//////// new  WS 



GetAllModeReglement(){

  return this.http.get(`${environment.API_BASE_URL}mode_reglement/all`);
}

GetAllTypeCaisse(){

  return this.http.get(`${environment.API_BASE_URL}type_caisse/all`);
}


GetAllBanque(){

  return this.http.get(`${environment.API_BASE_URL}banque/all`);
}


PostModeReglement(body : any){
  return this.http.post(`${environment.API_BASE_URL}mode_reglement`,body);
}




UpdateModeReglement(body : any){

  return this.http.put(`${environment.API_BASE_URL}mode_reglement/update`,body);
}








}
