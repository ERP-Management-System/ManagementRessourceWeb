import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MenuDepotDepartementComponent } from './menu-depot-departement.component';

describe('MenuDepotDepartementComponent', () => {
  let component: MenuDepotDepartementComponent;
  let fixture: ComponentFixture<MenuDepotDepartementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MenuDepotDepartementComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(MenuDepotDepartementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
