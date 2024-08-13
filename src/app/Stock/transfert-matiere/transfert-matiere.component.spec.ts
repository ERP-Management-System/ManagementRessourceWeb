import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TransfertMatiereComponent } from './transfert-matiere.component';

describe('TransfertMatiereComponent', () => {
  let component: TransfertMatiereComponent;
  let fixture: ComponentFixture<TransfertMatiereComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TransfertMatiereComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TransfertMatiereComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
