export interface DDE_ACHAT {
  designation: string,
}

export interface Article {
  code: number,
  code_saisie: string,
  designation: string,
  actif: boolean,
  stocked: boolean,
  codeCategorieArticle: {
      code: number,
      designation: string,
      actif: boolean,
  },
  categorie: number,
  haveDteExp: boolean,
  nom_Demandeur: string,
  codeDemandeur: number,
  inventoryStatus: string,
  quantity: number,
  price: number,
  description: string
}

export interface ParamsModel {
  // code: string,
  // designation: string,
  valeur: string,
}

export interface etails_dde_achat {
  codeddeAchat: number,
  codeArticle: number,
  article: {
      codeSaisie: string,
      categorie: number
  }
}


export interface articledemo {
  codeSaisie: string,
  designation: string,
  codeCategorieArticle: {
      designation: string,
      categorie: number
  },
  familleCategorieArticle: {
      designation: string,
      codesaisie: string
  }
}

export interface DdeAchatWithDetails {
  nom_demandeur: string,
  coutdemande: number,
  codedemandeur: number,
  nomdemandeur: string,
  etatdemande: string,
  usercreate: string,
  dateCreate: Date,
  detailsDdeAchatDTOS: {
      codedemandeur: number,
      nomdemandeur: string,
      qtedde: number,
      codearticle: string,
      designationararticle: string,
      designationenarticle: string,
      usercreate: string,
  }
}