// export interface DDE_ACHAT {
//   designation: string,
// }

// export interface Article {
//   code: number,
//   code_saisie: string,
//   designation: string,
//   actif: boolean,
//   stocked: boolean,
//   codeCategorieArticle: {
//       code: number,
//       designation: string,
//       actif: boolean,
//   },
//   categorie: number,
//   haveDteExp: boolean,
//   nom_Demandeur: string,
//   codeDemandeur: number,
//   inventoryStatus: string,
//   quantity: number,
//   price: number,
//   description: string
// }

// export interface ParamsModel {
//   // code: string,
//   // designation: string,
//   valeur: string,
// }

// export interface etails_dde_achat {
//   codeddeAchat: number,
//   codeArticle: number,
//   article: {
//       codeSaisie: string,
//       categorie: number
//   }
// }


// export interface articledemo {
//   codeSaisie: string,
//   designation: string,
//   codeCategorieArticle: {
//       designation: string,
//       categorie: number
//   },
//   familleCategorieArticle: {
//       designation: string,
//       codesaisie: string
//   }
// }

// export interface DdeAchatWithDetails {
//   nom_demandeur: string,
//   coutdemande: number,
//   codedemandeur: number,
//   nomdemandeur: string,
//   etatdemande: string,
//   usercreate: string,
//   dateCreate: Date,
//   detailsDdeAchatDTOS: {
//       codedemandeur: number,
//       nomdemandeur: string,
//       qtedde: number,
//       codearticle: string,
//       designationararticle: string,
//       designationenarticle: string,
//       usercreate: string,
//   }
// }


export interface Banque{
code:number,
codeSaisie:string,
designationAr:string,
designationLt:string

}

export interface TypeCaisse{
  code:number,
  codeSaisie:string,
  designationAr:string,
  designationLt:string
  
  }

  
export interface ModeReglement {
  code: number
  code_saisie: string,
  designationAr: string,
  designationLt: string,
  actif: string,
  codeTypeCaisse: number,
  codeBanque: number,
  banque:{
    code:number,
    designationAr: string,
    designationLt: string,

  },
  typecaisse:{
    code:number;
    designationAr: string,
    designationLt: string,
  }
}



export interface Matiere {
  code: number
  code_saisie: string,
  designationAr: string,
  designationLt: string,
  actif: boolean,
  name:string,
  codeTypeMatiereDTO:{
    code:number,
    code_saisie: string,
    designationAr: string,
    designationLt: string,
    actif: boolean,
  }


  
  
}

export interface AppelOffre{
  code:number,
  codeSaisie:string,
  designationAr: string,
  designationLt: string,
  actif: boolean,  
  visible:boolean,
  modeReglementDTO:{
    code:number,
    codeSaisie:string,
    designationAr: string,
    designationLt: string,
    actif: boolean,  
    visible:boolean,
  },
  codeModeReglement:number,
  codeFournisseur:number,
  fournisseurDTO:{
    code:number,
    codeSaisie:string,
    designationAr: string,
    designationLt: string,
    actif: boolean,  
    visible:boolean,
  }

}


export interface Unite {
  code: number,
  codeSaisie: string,
  designationAr: string,
  designationLt: string,
  actif: boolean,
}


export interface Coloris {
  code: number,
  codeSaisie: string,
  designationAr: any,
  designationLt: string,
  actif: boolean,
}


export interface DetailsAppelOffre{
  code:number,
  codeSaisie:string, 
  name:string,
  detailsAppelOffreDTOs:{
    codeAppelOffre:number,
    codeMatiere:number,
    designationMatiereAr: string,
    designationMatiereLT: string,
    codeSaisieMatiere:string,
    codeColoris:number,
    designationColorisAr: string,
    designationColorisLT: string,
    codeSaisieColoris:string,
    codeUnite:number,
    designationUniteAr: string,
    designationUniteLT: string,
    codeSaisieUnite:string,
    qteDemander:number,
    actif: boolean,  
    visible:boolean,
    usercreate:string,
    datecreate:Date,

  }


  

}




export interface AO{
  code:number,
  designation:string, 
  unite:string,
  coloris:string,
  quantite:string, 
  


}