import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SideBarProductComponent } from './side-bar-product.component';

describe('SideBarProductComponent', () => {
  let component: SideBarProductComponent;
  let fixture: ComponentFixture<SideBarProductComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: []
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SideBarProductComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
