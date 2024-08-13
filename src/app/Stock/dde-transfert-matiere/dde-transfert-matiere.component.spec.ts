import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DdeTransfertMatiereComponent } from './dde-transfert-matiere.component';

describe('DdeTransfertMatiereComponent', () => {
  let component: DdeTransfertMatiereComponent;
  let fixture: ComponentFixture<DdeTransfertMatiereComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DdeTransfertMatiereComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DdeTransfertMatiereComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
