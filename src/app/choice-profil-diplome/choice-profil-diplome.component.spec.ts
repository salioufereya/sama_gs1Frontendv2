import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChoiceProfilDiplomeComponent } from './choice-profil-diplome.component';

describe('ChoiceProfilDiplomeComponent', () => {
  let component: ChoiceProfilDiplomeComponent;
  let fixture: ComponentFixture<ChoiceProfilDiplomeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChoiceProfilDiplomeComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ChoiceProfilDiplomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
