import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TypeCaisseComponent } from './type-caisse.component';

describe('TypeCaisseComponent', () => {
  let component: TypeCaisseComponent;
  let fixture: ComponentFixture<TypeCaisseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TypeCaisseComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TypeCaisseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
