import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';
import { AuthGuard } from './auth-guard';

describe('authGuardGuard', () => {
  const executeGuard: CanActivateFn = async (...guardParameters) => {
    const authGuard = TestBed.inject(AuthGuard);
    return await authGuard.canActivate(...guardParameters);
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AuthGuard],
    });
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});

