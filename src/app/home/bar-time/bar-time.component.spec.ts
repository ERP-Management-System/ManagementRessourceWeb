import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BarTimeComponent } from './bar-time.component';

describe('BarTimeComponent', () => {
  let component: BarTimeComponent;
  let fixture: ComponentFixture<BarTimeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [BarTimeComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(BarTimeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
