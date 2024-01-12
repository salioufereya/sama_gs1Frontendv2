import { TestBed } from '@angular/core/testing';
import { HttpInterceptor} from '@angular/common/http';

import { AuthInterceptor } from './auth.interceptor';

describe('authInterceptor', () => {
  const interceptor: HttpInterceptor = TestBed.inject(AuthInterceptor);

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        AuthInterceptor,
      ],
    });
  });

  it('should be created', () => {
    expect(interceptor).toBeTruthy();
  });
});
