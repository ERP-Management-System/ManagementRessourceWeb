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
import { TestPageComponent } from './test-page/test-page.component';

const routes: Routes = [
  { path: 'home', component: HomeComponent},
  { path: '', redirectTo: '/home', pathMatch: 'full'},
  {path: 'parametrage_central', component: ParametrageCentralComponent},
  {path: 'test', component: TestPageComponent},
  {path: 'mode_reglement', component: ModeReglementComponent},
  {path: 'devise', component: DeviseComponent},
  {path: 'banque', component: BanqueComponent},
  {path: 'saison', component: SaisonComponent},
  {path: 'type_caisse', component: TypeCaisseComponent},
  {path: 'region', component: RegionComponent},
  

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
