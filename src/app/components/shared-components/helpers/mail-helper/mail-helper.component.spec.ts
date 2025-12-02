import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MailHelperComponent } from './mail-helper.component';

describe('MailHelperComponent', () => {
  let component: MailHelperComponent;
  let fixture: ComponentFixture<MailHelperComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MailHelperComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MailHelperComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
