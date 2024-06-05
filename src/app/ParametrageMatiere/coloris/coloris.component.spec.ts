import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ColorisComponent } from './coloris.component';

describe('ColorisComponent', () => {
  let component: ColorisComponent;
  let fixture: ComponentFixture<ColorisComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ColorisComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ColorisComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
