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

const routes: Routes = [
  // { path: 'home', component: HomeComponent},
  // { path: '', redirectTo: '/', pathMatch: 'full'},
  // {path: '', component: HomeComponent, pathMatch: 'full' , redirectTo: ''},
  {
    path: '',
    children: [
      {
        pathMatch: 'full',
        path: '',
        component: HomeComponent,
      }
    ]
  },
  { path: 'parametrageCentral', component: ParametrageCentralComponent },
 
  { path: 'mode_reglement', component: ModeReglementComponent },
  { path: 'devise', component: DeviseComponent },
  { path: 'banque', component: BanqueComponent },
  { path: 'saison', component: SaisonComponent },
  { path: 'type_caisse', component: TypeCaisseComponent },
  { path: 'region', component: RegionComponent },

  { path: 'menu_parametrage_matiere', component: MenuParametrageMatiereComponent }, 
  { path: 'menu_parametrage_matiere/matiere', component: MatiereComponent },
  { path: 'menu_parametrage_matiere/taille', component: TailleComponent  },
  { path: 'menu_parametrage_matiere/type_matiere', component: TypeMatiereComponent },
  { path: 'menu_parametrage_matiere/coloris', component: ColorisComponent },
  { path: 'menu_parametrage_matiere/grille_taille', component: GrilleTailleComponent },
 
  { path: 'menu_achat', component: AchatMenuComponent },
  { path: 'menu_achat/appel_offre', component: AppelOffreComponent },
  { path: 'menu_achat/demande_achat', component: DemandeAchatComponent },

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { } 
export const ArrayOfComponents = [MenuParametrageMatiereComponent, 
  MatiereComponent, TailleComponent]