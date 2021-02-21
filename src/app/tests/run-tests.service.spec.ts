import { TestBed } from '@angular/core/testing';

import { RunTestsService } from './run-tests.service';

describe('RunTestsService', () => {
  let service: RunTestsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RunTestsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
