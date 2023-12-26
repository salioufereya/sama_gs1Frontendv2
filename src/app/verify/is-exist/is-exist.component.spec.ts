import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IsExistComponent } from './is-exist.component';

describe('IsExistComponent', () => {
  let component: IsExistComponent;
  let fixture: ComponentFixture<IsExistComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IsExistComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(IsExistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
