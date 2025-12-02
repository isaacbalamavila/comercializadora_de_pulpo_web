import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ErrorSpanComponent } from './error-span.component';

describe('ErrorSpanComponent', () => {
  let component: ErrorSpanComponent;
  let fixture: ComponentFixture<ErrorSpanComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ErrorSpanComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ErrorSpanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
