import { TestBed } from '@angular/core/testing';

import { BfaregistrationService } from './bfaregistration.service';

describe('BfaregistrationService', () => {
  let service: BfaregistrationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BfaregistrationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
