import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ValidationTransfertMatiereComponent } from './validation-transfert-matiere.component';

describe('ValidationTransfertMatiereComponent', () => {
  let component: ValidationTransfertMatiereComponent;
  let fixture: ComponentFixture<ValidationTransfertMatiereComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ValidationTransfertMatiereComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ValidationTransfertMatiereComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
