import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { BanqueComponent } from './parametrageCenral/banque/banque.component';
import { DeviseComponent } from './parametrageCenral/devise/devise.component';
import { ModeReglementComponent } from './parametrageCenral/mode-reglement/mode-reglement.component';
import { ParametrageCentralComponent } from './parametrageCenral/parametrage-central/parametrage-central.component';
import { RegionComponent } from './parametrageCenral/region/region.component';
import { SaisonComponent } from './parametrageCenral/saison/saison.component';
import { TypeCaisseComponent } from './parametrageCenral/type-caisse/type-caisse.component';
 
import { MenuParametrageMatiereComponent } from './ParametrageMatiere/menu-parametrage-matiere/menu-parametrage-matiere.component';
import { ColorisComponent } from './ParametrageMatiere/coloris/coloris.component';
import { GrilleTailleComponent } from './ParametrageMatiere/grille-taille/grille-taille.component';
import { MatiereComponent } from './ParametrageMatiere/matiere/matiere.component';
import { TailleComponent } from './ParametrageMatiere/taille/taille.component';
import { TypeMatiereComponent } from './ParametrageMatiere/type-matiere/type-matiere.component';
import { AchatMenuComponent } from './Achat/achat-menu/achat-menu.component';
import { AppelOffreComponent } from './Achat/appel-offre/appel-offre.component';
import { DemandeAchatComponent } from './Achat/demande-achat/demande-achat.component';
import { UniteComponent } from './ParametrageMatiere/unite/unite.component'; 
 
import { OrdreAchatComponent } from './Achat/ordre-achat/ordre-achat.component';
import { QcStrandardsComponent } from './ParametrageMatiere/qc-strandards/qc-strandards.component';
import { TaxeComponent } from './parametrageCenral/taxe/taxe.component';
import { DepartementComponent } from './DepotDepartement/departement/departement.component';
import { MenuDepotDepartementComponent } from './DepotDepartement/menu-depot-departement/menu-depot-departement.component';
import { DepotComponent } from './DepotDepartement/depot/depot.component';
import { CategorieDepotComponent } from './DepotDepartement/categorie-depot/categorie-depot.component';
import { AccessMenuComponent } from './Access/access-menu/access-menu.component';
import { SignatureUserComponent } from './Access/signature-user/signature-user.component';
import { BonReceptionComponent } from './Achat/bon-reception/bon-reception.component';
import { LoginComponent } from './home/login/login.component';
import { StockMenuComponent } from './Stock/stock-menu/stock-menu.component'; 
import { EditionStockComponent } from './Stock/edition-stock/edition-stock.component'; 
import { DdeTransfertMatiereComponent } from './Stock/dde-transfert-matiere/dde-transfert-matiere.component';
import { ValidationTransfertMatiereComponent } from './Stock/validation-transfert-matiere/validation-transfert-matiere.component';
import { TransfertMatiereComponent } from './Stock/transfert-matiere/transfert-matiere.component';
 
  

const routes: Routes = [
 
  {
    path: '',
    children: [
      {
        pathMatch: 'full',
        path: '',
        component: LoginComponent,
      }
    ]
  },
 
  { path: 'home', component: HomeComponent , data: {
    breadcrumb: null
  },
  children: []},


  // { path: 'menu_parametrage', component: ParametrageCentralComponent , data:{title:'Menu Parametrage'} },
  { path: 'menu_parametrage', component: ParametrageCentralComponent },

  { path: 'menu_parametrage/mode_reglement', component: ModeReglementComponent },
  { path: 'menu_parametrage/devise', component: DeviseComponent  },
  { path: 'menu_parametrage/banque', component: BanqueComponent  },
  { path: 'menu_parametrage/saison', component: SaisonComponent    },
  { path: 'menu_parametrage/type_caisse', component: TypeCaisseComponent },
  { path: 'menu_parametrage/region', component: RegionComponent },
  { path: 'menu_parametrage/taxe', component: TaxeComponent },


  {
    path: 'menu_parametrage',
    component: ParametrageCentralComponent,
    children: [
 
      // *********** Clients PAGE ************ //
      { path: 'menu_parametrage/mode_reglement', component: ModeReglementComponent },
      { path: 'menu_parametrage/DeviseComponent', component: DeviseComponent },
   
    ]
  },




  { path: 'menu_parametrage_matiere', component: MenuParametrageMatiereComponent }, 
  { path: 'menu_parametrage_matiere/matiere', component: MatiereComponent },
  { path: 'menu_parametrage_matiere/taille', component: TailleComponent  },
  { path: 'menu_parametrage_matiere/type_matiere', component: TypeMatiereComponent },
  { path: 'menu_parametrage_matiere/coloris', component: ColorisComponent },
  { path: 'menu_parametrage_matiere/grille_taille', component: GrilleTailleComponent },
  { path: 'menu_parametrage_matiere/unite', component: UniteComponent },
  { path: 'menu_parametrage_matiere/qc_standards', component: QcStrandardsComponent },


  { path: 'menu_depot_departement', component: MenuDepotDepartementComponent }, 
  { path: 'menu_depot_departement/departement', component: DepartementComponent },
  { path: 'menu_depot_departement/depot', component: DepotComponent },
  { path: 'menu_depot_departement/categorie_depot', component: CategorieDepotComponent },
 
  { path: 'menu_achat', component: AchatMenuComponent },
  { path: 'menu_achat/appel_offre', component: AppelOffreComponent },
  { path: 'menu_achat/demande_achat', component: DemandeAchatComponent },
  { path: 'menu_achat/ordre_achat', component: OrdreAchatComponent },
  { path: 'menu_achat/bon_reception', component: BonReceptionComponent },


  { path: 'menu_access', component: AccessMenuComponent },
  { path: 'menu_access/signature_user', component: SignatureUserComponent },
  // { path: 'menu_achat/demande_achat', component: DemandeAchatComponent },
  // { path: 'menu_achat/ordre_achat', component: OrdreAchatComponent },
  
  { path: 'menu_stock', component: StockMenuComponent },
  { path: 'menu_stock/edition', component: EditionStockComponent },
  { path: 'menu_stock/demande_transfert', component: DdeTransfertMatiereComponent },
  { path: 'menu_stock/transfert_matiere', component: TransfertMatiereComponent }, 
  { path: 'menu_stock/validation_transfert_matiere', component: ValidationTransfertMatiereComponent },

 



];

@NgModule({
  imports: [RouterModule.forRoot(routes, {
    paramsInheritanceStrategy: 'always'
  })],
  exports: [RouterModule]
})
export class AppRoutingModule { } 
export const ArrayOfComponents = [MenuParametrageMatiereComponent, 
  MatiereComponent, TailleComponent]