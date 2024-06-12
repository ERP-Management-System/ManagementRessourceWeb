import { Component } from '@angular/core';
import {BreadcrumbModule} from 'primeng/breadcrumb';
import {MenuItem} from 'primeng/api';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'ManageRessourceWeb';

  public links = [
    { route: '/', label: 'Dashboard', exact: true },
    { route: '/users', label: 'Users' },
    { route: '/projects', label: 'Projects' },
  ];
  
}
