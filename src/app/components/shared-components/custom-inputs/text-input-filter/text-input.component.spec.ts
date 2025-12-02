import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TextInputFilterComponent } from './text-input-filter.component';

describe('TextInputComponent', () => {
  let component: TextInputFilterComponent;
  let fixture: ComponentFixture<TextInputFilterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TextInputFilterComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TextInputFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
