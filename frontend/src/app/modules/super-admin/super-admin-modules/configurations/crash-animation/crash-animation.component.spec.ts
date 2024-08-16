import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CrashAnimationComponent } from './crash-animation.component';

describe('CrashAnimationComponent', () => {
  let component: CrashAnimationComponent;
  let fixture: ComponentFixture<CrashAnimationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CrashAnimationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CrashAnimationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
