import { TestBed } from '@angular/core/testing';

import { PermissionSystemService } from './permission-system.service';

describe('PermissionSystemService', () => {
  let service: PermissionSystemService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PermissionSystemService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
