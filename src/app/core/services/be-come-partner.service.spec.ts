import { TestBed } from '@angular/core/testing';

import { BeComePartnerService } from './be-come-partner.service';

describe('BeComePartnerService', () => {
  let service: BeComePartnerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BeComePartnerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
