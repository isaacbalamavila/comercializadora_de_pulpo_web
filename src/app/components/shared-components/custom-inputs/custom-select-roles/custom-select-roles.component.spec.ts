import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomSelectRolesComponent } from './custom-select-roles.component';

describe('CustomSelectRolesComponent', () => {
  let component: CustomSelectRolesComponent;
  let fixture: ComponentFixture<CustomSelectRolesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CustomSelectRolesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CustomSelectRolesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
