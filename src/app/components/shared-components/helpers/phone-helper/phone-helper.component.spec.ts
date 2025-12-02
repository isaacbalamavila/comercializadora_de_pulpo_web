import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PhoneHelperComponent } from './phone-helper.component';

describe('PhoneHelperComponent', () => {
  let component: PhoneHelperComponent;
  let fixture: ComponentFixture<PhoneHelperComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PhoneHelperComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PhoneHelperComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
