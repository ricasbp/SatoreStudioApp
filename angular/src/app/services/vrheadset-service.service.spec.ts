import { TestBed } from '@angular/core/testing';

import { VRHeadsetService } from './vrheadset-service.service';

describe('VRHeadsetService', () => {
  let service: VRHeadsetService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(VRHeadsetService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
