import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditCrashGameSettingComponent } from './edit-crash-game-setting.component';

describe('EditCrashGameSettingComponent', () => {
  let component: EditCrashGameSettingComponent;
  let fixture: ComponentFixture<EditCrashGameSettingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditCrashGameSettingComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditCrashGameSettingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
