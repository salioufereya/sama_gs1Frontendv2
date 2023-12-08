import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListDiplomesComponent } from './list-diplomes.component';

describe('ListDiplomesComponent', () => {
  let component: ListDiplomesComponent;
  let fixture: ComponentFixture<ListDiplomesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListDiplomesComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ListDiplomesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
