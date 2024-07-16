import { Component } from '@angular/core';

@Component({
  selector: 'app-bar-time',
  templateUrl: './bar-time.component.html',
  styleUrl: './bar-time.component.css'
})
export class BarTimeComponent {
  ngOnInit(): void {
    this.liveClock(); 
  }
  liveDateTime = new Date();
  liveClock() {
    setInterval(() => {
      this.liveDateTime = new Date();
    }, 1000);
  }
  
}
