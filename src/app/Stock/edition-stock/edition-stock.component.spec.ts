import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditionStockComponent } from './edition-stock.component';

describe('EditionStockComponent', () => {
  let component: EditionStockComponent;
  let fixture: ComponentFixture<EditionStockComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [EditionStockComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(EditionStockComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
