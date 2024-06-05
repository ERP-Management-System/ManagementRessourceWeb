import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TypeMatiereComponent } from './type-matiere.component';

describe('TypeMatiereComponent', () => {
  let component: TypeMatiereComponent;
  let fixture: ComponentFixture<TypeMatiereComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TypeMatiereComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TypeMatiereComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
