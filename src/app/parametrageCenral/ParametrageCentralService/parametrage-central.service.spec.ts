import { TestBed } from '@angular/core/testing';

import { ParametrageCentralService } from './parametrage-central.service';

describe('ParametrageCentralService', () => {
  let service: ParametrageCentralService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ParametrageCentralService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
