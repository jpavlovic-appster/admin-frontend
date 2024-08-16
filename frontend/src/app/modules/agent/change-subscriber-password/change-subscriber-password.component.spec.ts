import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChangeSubscriberPasswordComponent } from './change-subscriber-password.component';

describe('ChangeSubscriberPasswordComponent', () => {
  let component: ChangeSubscriberPasswordComponent;
  let fixture: ComponentFixture<ChangeSubscriberPasswordComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ChangeSubscriberPasswordComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ChangeSubscriberPasswordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
