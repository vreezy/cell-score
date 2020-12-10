import { TestBed } from '@angular/core/testing';

import { CycleService } from './cycle.service';
import * as Constants from './constants';

describe('CycleService', () => {
  let service: CycleService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CycleService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('getCycle -1', () => {
    expect(service.getCycle(new Date("January 8, 2014 03:00:00"))).toBe(-1);
  });

  it('getCycle First Cycle ever we start with 0', () => {
    expect(service.getCycle(new Date("January 8, 2014 04:00:00"))).toBe(0);
  });

  it('getCycle Second Cycle should be 1', () => {
    const zero = new Date("January 8, 2014 04:00:00");
    zero.setTime(zero.getTime() + Constants.CYCLE_LENGTH);
    expect(service.getCycle(zero)).toBe(1);
  });

  it('getCycle on December 8, 2020 12:00:00', () => {
    expect(service.getCycle(new Date("December 8, 2020 12:00:00"))).toBe(346);
  });

  // it('nextCheckPointInMS is not binger than xxx', () => {
  //   expect(service.nextCheckPointInMS(new Date())).toBeLessThanOrEqual(18000000);
  // });
});
