import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ValidationTextComponent } from './validation-text.component';

describe('ValidationTextComponent', () => {
  let component: ValidationTextComponent;
  let fixture: ComponentFixture<ValidationTextComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ValidationTextComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ValidationTextComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
