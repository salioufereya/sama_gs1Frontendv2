import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GestionEcoleComponent } from './gestion-ecole.component';

describe('GestionEcoleComponent', () => {
  let component: GestionEcoleComponent;
  let fixture: ComponentFixture<GestionEcoleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GestionEcoleComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(GestionEcoleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
