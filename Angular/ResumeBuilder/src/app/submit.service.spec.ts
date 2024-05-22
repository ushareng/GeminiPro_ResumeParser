import { TestBed } from '@angular/core/testing';

import { SubmitService } from './submit.service';

describe('SubmitService', () => {
  let service: SubmitService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SubmitService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
