import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GrilleTailleComponent } from './grille-taille.component';

describe('GrilleTailleComponent', () => {
  let component: GrilleTailleComponent;
  let fixture: ComponentFixture<GrilleTailleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [GrilleTailleComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(GrilleTailleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
