import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrdreAchatComponent } from './ordre-achat.component';

describe('OrdreAchatComponent', () => {
  let component: OrdreAchatComponent;
  let fixture: ComponentFixture<OrdreAchatComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [OrdreAchatComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(OrdreAchatComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
