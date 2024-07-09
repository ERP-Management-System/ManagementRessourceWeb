import { HttpClient,HttpHeaders } from '@angular/common/http';
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




  GetcompteurCodeSaisie(compteur:string) {

    return this.http.get(`${environment.API_BASE_URL}compteur/`+compteur);
  }


  ///////////////

  GetFormControlName(desig: string) {
    return this.http.get(`${environment.API_BASE_URL}FormControl/code?code=` + desig);
  }

  GetArticleActif() {
    return this.http.get(`${environment.API_BASE_URL}achat/article/actif?actif=true`);
  }
  GetFlActif() {
    return this.http.get(`${environment.API_BASE_URL}Filiale/actif?actif=true`);
  }

  // frs 
  GetFrsActif() {
    return this.http.get(`${environment.API_BASE_URL}achat/fournisseur/actif?actif=true`);
  }

  GetFrsByCode(code: number) {
    return this.http.get(`${environment.API_BASE_URL}achat/fournisseur/` + code);
  }


  ///
  GetArticleBycode(code: number) {

    return this.http.get(`${environment.API_BASE_URL}achat/article/` + code);
  }
  GetParams(code: string) {

    return this.http.get(`${environment.API_BASE_URL}param/code?code=` + code);

  }
  ////////////////////////////////////////////////////////////////////////////////////
  // DDE AHCAT 
  // GetDdeAchatByCode(code: number) {
  //   return this.http.get(`${environment.API_BASE_URL_ACHAT}dde_achat/` + code);
  // }
  // GetAllDdeAchat() {
  //   return this.http.get(`${environment.API_BASE_URL_ACHAT}demande_achat/all`);
  // }
  // PostDdeAchat(body: any) {
  //   return this.http.post(`${environment.API_BASE_URL_ACHAT}dde_achat`, body);
  // }
  // PutDdeAchat(body: any) {
  //   return this.http.put(`${environment.API_BASE_URL_ACHAT}dde_achat/update`, body);
  // }
  // DeleteDdeAchat(code: number) {
  //   return this.http.delete(`${environment.API_BASE_URL_ACHAT}dde_achat/delete/` + code);
  // }

  /////////////////////////////////////////////////////////////////////////////
  //  DDE TRANSFERT 
  GetDdeTransfertByCode(code: number) {
    return this.http.get(`${environment.API_BASE_URL_ACHAT}dde_transfert/` + code);
  }
  GetAllDdeTransfert() {
    return this.http.get(`${environment.API_BASE_URL_ACHAT}dde_transfert/all`);
  }
  PostDdeTransfert(body: any) {
    return this.http.post(`${environment.API_BASE_URL_ACHAT}dde_transfert`, body);
  }
  PutDdeTransfert(body: any) {
    return this.http.put(`${environment.API_BASE_URL_ACHAT}dde_transfert/update`, body);
  }
  DeleteDdeTransfert(code: number) {
    return this.http.delete(`${environment.API_BASE_URL}dde_transfert/delete/` + code);
  }


  //////// ModeReglement 

  GetModeReglementActifAndIsPrincipal() {

    return this.http.get(`${environment.API_BASE_URL}achat/mode_reglement/actifAndIsPrincipal?actif=1&principal=1`);
  }






  //////// new  WS 



  GetAllModeReglement() {

    return this.http.get(`${environment.API_BASE_URL}mode_reglement/all`);
  }

  GetAllTypeCaisse() {

    return this.http.get(`${environment.API_BASE_URL}type_caisse/all`);
  }


  GetAllBanque() {

    return this.http.get(`${environment.API_BASE_URL}banque/all`);
  }


  PostModeReglement(body: any) {
    return this.http.post(`${environment.API_BASE_URL}mode_reglementss`, body);
  }

  getPDFf() {
    return this.http.get(`${environment.API_BASE_URL}mode_reglement/exp`, { responseType: "blob" });
  }



  UpdateModeReglement(body: any) {

    return this.http.put(`${environment.API_BASE_URL}mode_reglement/update`, body);
  }





  DeleteModeReglement(code: number) {
    return this.http.delete(`${environment.API_BASE_URL}mode_reglement/delete/` + code);
  }


  GetMatiereActive() {

    return this.http.get(`${environment.API_BASE_URL_ACHAT}matiere/codeStatuMatiere?codeStatuMatiere=1`);
  }
  GetMatiere() {

    return this.http.get(`${environment.API_BASE_URL_ACHAT}matiere/all`);
  }

  GetMatiereByCode(code: number) {

    return this.http.get(`${environment.API_BASE_URL_ACHAT}matiere/` + code);
  }


  // GetMatiereByCodeAO(code : number){

  //   return this.http.get(`${environment.API_BASE_URL_ACHAT}matieres/`+code);
  // }


  DeleteMatiere(code: number) {
    return this.http.delete(`${environment.API_BASE_URL_ACHAT}matiere/delete/` + code);
  }


  UpdateMatiere(body: any) {

    return this.http.put(`${environment.API_BASE_URL_ACHAT}matiere/update`, body);
  }


  GetAllTypeMatiere() {

    return this.http.get(`${environment.API_BASE_URL_ACHAT}type_matiere/all`);
  }



  // Appel offre



  GetAppelOffre() {

    return this.http.get(`${environment.API_BASE_URL_ACHAT}appel_offre/all`);
  }

  GetDetailsAppelOffreByCode(code: number) {

    return this.http.get(`${environment.API_BASE_URL_ACHAT}details_appel_offre/` + code);
  }

  
  GetAppelOffreByCode(code: number) {

    return this.http.get(`${environment.API_BASE_URL_ACHAT}appel_offre/` + code);
  }

  GetAppelOffreByEtatApprouved(codeEtatApprouverOrdreAchat : number) {

    return this.http.get(`${environment.API_BASE_URL_ACHAT}appel_offre/EtatApprouverOrdreAchat/`+codeEtatApprouverOrdreAchat);
  }


  getAppelOffreEdition(code: number) {
    return this.http.get(`${environment.API_BASE_URL_ACHAT}details_appel_offre/edition/` + code, { responseType: "blob" });
  }


  UpdateAppelOffre(body: any) {

    return this.http.put(`${environment.API_BASE_URL_ACHAT}appel_offre/update`, body);
  }


  DeleteAppelOffre(code: number) {
    return this.http.delete(`${environment.API_BASE_URL_ACHAT}appel_offre/delete/` + code);
  }


  PostAppelOffreWithDetails(body: any) {
    return this.http.post(`${environment.API_BASE_URL_ACHAT}details_appel_offre`, body);
  }

  PostAppelOffre(body: any) {
    return this.http.post(`${environment.API_BASE_URL_ACHAT}appel_offre`, body);
  }

  GetColoris() {

    return this.http.get(`${environment.API_BASE_URL_ACHAT}coloris/all`);
  }

  DeleteColoris(code: number) {
    return this.http.delete(`${environment.API_BASE_URL_ACHAT}coloris/delete/` + code);
  }
  UpdateColoris(body: any) {
    return this.http.put(`${environment.API_BASE_URL_ACHAT}coloris/update`, body);
  }
  PostColoris(body: any) {
    return this.http.post(`${environment.API_BASE_URL_ACHAT}coloris`, body);
  }



  ///grille taille 

  GetGrilleTaille() {

    return this.http.get(`${environment.API_BASE_URL_ACHAT}grille_taille/all`);
  }


  DeleteGrilleTaille(code: number) {
    return this.http.delete(`${environment.API_BASE_URL_ACHAT}grille_taille/delete/` + code);
  }
  UpdateGrilleTaille(body: any) {
    return this.http.put(`${environment.API_BASE_URL_ACHAT}grille_taille/update`, body);
  }
  PostGrilleTaille(body: any) {
    return this.http.post(`${environment.API_BASE_URL_ACHAT}grille_taille`, body);
  }



  ///taille 

  GetTaille() {

    return this.http.get(`${environment.API_BASE_URL_ACHAT}taille/all`);
  }
  DeleteTaille(code: number) {
    return this.http.delete(`${environment.API_BASE_URL_ACHAT}taille/delete/` + code);
  }
  UpdateTaille(body: any) {
    return this.http.put(`${environment.API_BASE_URL_ACHAT}taille/update`, body);
  }
  PostTaille(body: any) {
    return this.http.post(`${environment.API_BASE_URL_ACHAT}taille`, body);
  }




  ///type matiere 

  GetTypeMatiere() {

    return this.http.get(`${environment.API_BASE_URL_ACHAT}type_matiere/all`);
  }
  DeleteTypeMatiere(code: number) {
    return this.http.delete(`${environment.API_BASE_URL_ACHAT}type_matiere/delete/` + code);
  }
  UpdateTypeMatiere(body: any) {
    return this.http.put(`${environment.API_BASE_URL_ACHAT}type_matiere/update`, body);
  }
  PostTypeMatiere(body: any) {
    return this.http.post(`${environment.API_BASE_URL_ACHAT}type_matiere`, body);
  }


  ///Unite 

  GetUnite() {

    return this.http.get(`${environment.API_BASE_URL_ACHAT}unite/all`);
  }
  DeleteUnite(code: number) {
    return this.http.delete(`${environment.API_BASE_URL_ACHAT}unite/delete/` + code);
  }
  UpdateUnite(body: any) {
    return this.http.put(`${environment.API_BASE_URL_ACHAT}unite/update`, body);
  }
  PostUnite(body: any) {
    return this.http.post(`${environment.API_BASE_URL_ACHAT}unite`, body);
  }





  /// demande achat 




  GetDemandeAchat() {

    return this.http.get(`${environment.API_BASE_URL_ACHAT}demande_achat/all`);
  }

  GetDetailsDemandeAchatByCode(code: number) {

    return this.http.get(`${environment.API_BASE_URL_ACHAT}details_demande_achat/` + code);
  }

  GetDemandeAchatByCodeIn(code: number) {

    return this.http.get(`${environment.API_BASE_URL_ACHAT}demande_achat/` + code);
  }


  getDemandeAchatEdition(code: number) {
    return this.http.get(`${environment.API_BASE_URL_ACHAT}details_demande_achat/edition/` + code, { responseType: "blob" });
  }


  UpdateDemandeAchat(body: any) {

    return this.http.put(`${environment.API_BASE_URL_ACHAT}demande_achat/update`, body);
  }

  
  ApprouveDemandeAchat(body: any) {

    return this.http.put(`${environment.API_BASE_URL_ACHAT}demande_achat/approuver`, body);
  }
  CancelApprouveDemandeAchat(body: any) {

    return this.http.put(`${environment.API_BASE_URL_ACHAT}demande_achat/cancel_approuver`, body);
  }
  
  

  DeleteDemandeAchat(code: number) {
    return this.http.delete(`${environment.API_BASE_URL_ACHAT}demande_achat/delete/` + code);
  }


  PostDemandeAchatWithDetails(body: any) {
    return this.http.post(`${environment.API_BASE_URL_ACHAT}demande_achat`, body);
  }


  GetDemandeAchatByEtatApprouved(codeEtatApprouver : number) {

    return this.http.get(`${environment.API_BASE_URL_ACHAT}demande_achat/EtatApprouver/`+codeEtatApprouver);
  }


  ///// depotttt


  
  GetDepot() {

    return this.http.get(`${environment.API_BASE_URL_ACHAT}depot/all`);
  }


  GetDepotPrincipal() {

    return this.http.get(`${environment.API_BASE_URL_ACHAT}depot/principal?principal=true`);
  }


  GetDepotByCode(code: number) {

    return this.http.get(`${environment.API_BASE_URL_ACHAT}depot/` + code);
  }


  getDepotEdition(code: number) {
    return this.http.get(`${environment.API_BASE_URL_ACHAT}depot/edition/` + code, { responseType: "blob" });
  }


  UpdateDepot(body: any) {

    return this.http.put(`${environment.API_BASE_URL_ACHAT}depot/update`, body);
  }


  DeleteDepot(code: number) {
    return this.http.delete(`${environment.API_BASE_URL_ACHAT}depot/delete/` + code);
  }


  PostDepot(body: any) {
    return this.http.post(`${environment.API_BASE_URL_ACHAT}depot`, body);
  }



////categorie depot 


GetCategorieDepot() {

  return this.http.get(`${environment.API_BASE_URL_ACHAT}categorie_depot/all`);
} 
GetCategorieDepotByCode(code: number) {

  return this.http.get(`${environment.API_BASE_URL_ACHAT}categorie_depot/` + code);
}


getCategorieDepotEdition(code: number) {
  return this.http.get(`${environment.API_BASE_URL_ACHAT}categorie_depot/edition/` + code, { responseType: "blob" });
}


UpdateCategorieDepot(body: any) {

  return this.http.put(`${environment.API_BASE_URL_ACHAT}categorie_depot/update`, body);
}


DeleteCategorieDepot(code: number) {
  return this.http.delete(`${environment.API_BASE_URL_ACHAT}categorie_depot/delete/` + code);
}


PostCategorieDepot(body: any) {
  return this.http.post(`${environment.API_BASE_URL_ACHAT}categorie_depot`, body);
}



  //departement 

  
  GetDepartement() {

    return this.http.get(`${environment.API_BASE_URL_ACHAT}departement/all`);
  }


  GetDepartementByCode(code: number) {

    return this.http.get(`${environment.API_BASE_URL_ACHAT}departement/` + code);
  }


  getDepartementEdition(code: number) {
    return this.http.get(`${environment.API_BASE_URL_ACHAT}departement/edition/` + code, { responseType: "blob" });
  }


  UpdateDepartemenet(body: any) {

    return this.http.put(`${environment.API_BASE_URL_ACHAT}departement/update`, body);
  }


  DeleteDepartement(code: number) {
    return this.http.delete(`${environment.API_BASE_URL_ACHAT}departement/delete/` + code);
  }


  PostDepartemenet(body: any) {
    return this.http.post(`${environment.API_BASE_URL_ACHAT}departement`, body);
  }



  ///// ordre Achat


  GetOrdreAchat() {  
    const headers= new HttpHeaders()
  .set('content-type', 'application/json')
  .set('Accept-Language', 'ar');

    return this.http.get(`${environment.API_BASE_URL_ACHAT}ordre_achat/all`, { 'headers': headers });
  }

  GetOrdreAchatByCode(code: number) {

    return this.http.get(`${environment.API_BASE_URL_ACHAT}details_ordre_achat/` + code);
  }


  getOrderAchatEdition(code: number) {
    return this.http.get(`${environment.API_BASE_URL_ACHAT}details_ordre_achat/edition/` + code, { responseType: "blob" });
  }


  UpdateOrdreAchat(body: any) {

    return this.http.put(`${environment.API_BASE_URL_ACHAT}ordre_achat/update`, body);
  }


  DeleteOrdreAchat(code: number) {
    const headers= new HttpHeaders()
    .set('content-type', 'application/json')
    .set('Accept-Language', 'ar');
    return this.http.delete(`${environment.API_BASE_URL_ACHAT}ordre_achat/delete/` + code , {'headers':headers});
  }


  PostOrdreAchatWithDetails(body: any) {
    return this.http.post(`${environment.API_BASE_URL_ACHAT}ordre_achat`, body);
  }

  getOrdreAchatEdition(code: number) {
    return this.http.get(`${environment.API_BASE_URL_ACHAT}details_ordre_achat/edition/` + code, { responseType: "blob" });
  }

  GetOrdreAchatByEtatRecepetion(codeEtatReception : number) {

    return this.http.get(`${environment.API_BASE_URL_ACHAT}ordre_achat/etat_reception/`+codeEtatReception);
  }


  /// statu matiere

  GetAllStatuMatiere() {

    return this.http.get(`${environment.API_BASE_URL_ACHAT}statu_matiere/all`);
  }

  //taxe 


  GetTaxe() {

    return this.http.get(`${environment.API_BASE_URL}taxe/all`);
  }


  GetTaxeByTypeTaxe(type_taxe: number) {

    return this.http.get(`${environment.API_BASE_URL}taxe/type_taxe?type_taxe=` + type_taxe);
  }


  GetTypeTaxe() {

    return this.http.get(`${environment.API_BASE_URL}type_taxe/all`);
  }


  UpdateTaxe(body: any) {

    return this.http.put(`${environment.API_BASE_URL}taxe/update`, body);
  }


  DeleteTaxe(code: number) {
    return this.http.delete(`${environment.API_BASE_URL}taxe/delete/` + code);
  }


  PostTaxe(body: any) {
    return this.http.post(`${environment.API_BASE_URL}taxe`, body);
  }


  GetMntTimbre() { 
    return this.http.get(`${environment.API_BASE_URL}param/codeParam?codeParam=MntTimbre`); 
  }

  GetPasswordChangeApprouveAchat() { 
    return this.http.get(`${environment.API_BASE_URL}param/codeParam?codeParam=CodeChangeApprouveOA`); 
  }


  // userr 
    
  GetUser() {

    return this.http.get(`${environment.API_BASE_URL_ACCESS}accessUser/all`);
  }
  GetUserWithPassword() {

    return this.http.get(`${environment.API_BASE_URL_ACCESS}accessUser/allWithPass`);
  }

  
  // GetAllUser() {

  //   return this.http.get(`${environment.API_BASE_URL_ACHAT}accessUser/all`);
  // }


  // GetDepartementByCode(code: number) {

  //   return this.http.get(`${environment.API_BASE_URL_ACHAT}departement/` + code);
  // }


  // getDepartementEdition(code: number) {
  //   return this.http.get(`${environment.API_BASE_URL_ACHAT}departement/edition/` + code, { responseType: "blob" });
  // }

  PostUser(body: any) {
    return this.http.post(`${environment.API_BASE_URL_ACCESS}accessUser`, body);
  }
  UpdateUser(body: any) {

    return this.http.put(`${environment.API_BASE_URL_ACCESS}accessUser/update`, body);
  }


  DeleteUser(code: number) {
    return this.http.delete(`${environment.API_BASE_URL_ACCESS}accessUser/delete/` + code);
  }





}
