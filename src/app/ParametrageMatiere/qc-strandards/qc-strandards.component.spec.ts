import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QcStrandardsComponent } from './qc-strandards.component';

describe('QcStrandardsComponent', () => {
  let component: QcStrandardsComponent;
  let fixture: ComponentFixture<QcStrandardsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [QcStrandardsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(QcStrandardsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
