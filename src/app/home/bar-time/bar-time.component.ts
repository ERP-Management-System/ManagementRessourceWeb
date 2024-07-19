import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-bar-time',
  templateUrl: './bar-time.component.html',
  styleUrl: './bar-time.component.css'
})
export class BarTimeComponent implements OnInit {
  ngOnInit(): void {
    this.liveClock(); 
  }
  constructor(private route: ActivatedRoute, private router: Router) { }
  liveDateTime = new Date();
  liveClock() {
    setInterval(() => {
      this.liveDateTime = new Date();
    }, 1000);
  }

  visibleModalLogOut: boolean = false;
  formHeader = ".....";
  public onOpenModal(mode: string) {

    const container = document.getElementById('main-container');
    const button = document.createElement('button');
    button.type = 'button';
    button.style.display = 'none';
    button.setAttribute('data-toggle', 'modal'); 
    if (mode === 'Print') {


      button.setAttribute('data-target', '#ModalPrint');
      this.formHeader = "Log Out"
      this.visibleModalLogOut = true; 


    }

  }

  LogOut(){
    this.router.navigate([''], { relativeTo: this.route })

  }

  
}
