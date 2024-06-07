import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AchatMenuComponent } from './achat-menu.component';

describe('AchatMenuComponent', () => {
  let component: AchatMenuComponent;
  let fixture: ComponentFixture<AchatMenuComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AchatMenuComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AchatMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
