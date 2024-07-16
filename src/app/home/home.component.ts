import { Component, OnInit } from '@angular/core';
import { IdleService } from './idle.service'; 
import { environment } from 'src/environments/environment.development';

@Component({
  selector: 'app-home',
 
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent  {
 

  title = 'ManageRessourceWeb';
  
  
  constructor( private idleService: IdleService   ) {
  }
  
}
