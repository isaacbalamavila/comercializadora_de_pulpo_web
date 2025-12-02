import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChangePasswordComponentModal } from './change-password-modal.component';

describe('ChangePasswordComponent', () => {
  let component: ChangePasswordComponentModal;
  let fixture: ComponentFixture<ChangePasswordComponentModal>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChangePasswordComponentModal]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ChangePasswordComponentModal);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
