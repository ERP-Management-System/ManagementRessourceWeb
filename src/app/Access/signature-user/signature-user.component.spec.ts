import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SignatureUserComponent } from './signature-user.component';

describe('SignatureUserComponent', () => {
  let component: SignatureUserComponent;
  let fixture: ComponentFixture<SignatureUserComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SignatureUserComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SignatureUserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
