import { TestBed, inject } from '@angular/core/testing';

import { KsqlService } from './ksql.service';

describe('KsqlService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [KsqlService]
    });
  });

  it('should be created', inject([KsqlService], (service: KsqlService) => {
    expect(service).toBeTruthy();
  }));
});
