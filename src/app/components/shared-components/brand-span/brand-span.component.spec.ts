import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BrandSpanComponent } from './brand-span.component';

describe('BrandSpanComponent', () => {
  let component: BrandSpanComponent;
  let fixture: ComponentFixture<BrandSpanComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BrandSpanComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BrandSpanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
