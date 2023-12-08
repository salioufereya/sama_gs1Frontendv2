import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChoiceProfilComponent } from './choice-profil.component';

describe('ChoiceProfilComponent', () => {
  let component: ChoiceProfilComponent;
  let fixture: ComponentFixture<ChoiceProfilComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChoiceProfilComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ChoiceProfilComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
