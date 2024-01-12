import { TestBed } from '@angular/core/testing';
import { HttpInterceptor } from '@angular/common/http';

import { NetworkInterceptor } from './network.interceptor';

describe('networkInterceptor', () => {
  const interceptor: HttpInterceptor = TestBed.inject(NetworkInterceptor);

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        NetworkInterceptor,
      ],
    });
  });

  it('should be created', () => {
    expect(interceptor).toBeTruthy();
  });
});
