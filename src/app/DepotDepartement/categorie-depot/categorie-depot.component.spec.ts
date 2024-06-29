import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CategorieDepotComponent } from './categorie-depot.component';

describe('CategorieDepotComponent', () => {
  let component: CategorieDepotComponent;
  let fixture: ComponentFixture<CategorieDepotComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CategorieDepotComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CategorieDepotComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
