import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MenuParametrageMatiereComponent } from './menu-parametrage-matiere.component';

describe('MenuParametrageMatiereComponent', () => {
  let component: MenuParametrageMatiereComponent;
  let fixture: ComponentFixture<MenuParametrageMatiereComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MenuParametrageMatiereComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(MenuParametrageMatiereComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
