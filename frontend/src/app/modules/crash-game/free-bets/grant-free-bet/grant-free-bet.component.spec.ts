import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GrantFreeBetComponent } from './grant-free-bet.component';

describe('GrantFreeBetComponent', () => {
  let component: GrantFreeBetComponent;
  let fixture: ComponentFixture<GrantFreeBetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GrantFreeBetComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GrantFreeBetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
