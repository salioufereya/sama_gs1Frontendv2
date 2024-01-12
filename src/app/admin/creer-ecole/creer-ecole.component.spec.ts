import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreerEcoleComponent } from './creer-ecole.component';

describe('CreerEcoleComponent', () => {
  let component: CreerEcoleComponent;
  let fixture: ComponentFixture<CreerEcoleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreerEcoleComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CreerEcoleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
