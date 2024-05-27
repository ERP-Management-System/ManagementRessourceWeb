import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ParametrageCentralComponent } from './parametrage-central.component';

describe('ParametrageCentralComponent', () => {
  let component: ParametrageCentralComponent;
  let fixture: ComponentFixture<ParametrageCentralComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ParametrageCentralComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ParametrageCentralComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
