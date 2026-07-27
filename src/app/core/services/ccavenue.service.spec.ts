import { TestBed } from '@angular/core/testing';

import { CcavenueService } from './ccavenue.service';

describe('CcavenueService', () => {
  let service: CcavenueService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CcavenueService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
