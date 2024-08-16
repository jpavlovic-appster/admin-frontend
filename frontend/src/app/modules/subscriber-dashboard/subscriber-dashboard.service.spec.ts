import { TestBed } from '@angular/core/testing';

import { SubscriberDashboardService } from './subscriber-dashboard.service';

describe('SubscriberDashboardService', () => {
  let service: SubscriberDashboardService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SubscriberDashboardService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
