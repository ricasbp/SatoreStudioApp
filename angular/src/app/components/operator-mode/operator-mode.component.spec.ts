import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OperatorModeComponent } from './operator-mode.component';

describe('OperatorModeComponent', () => {
  let component: OperatorModeComponent;
  let fixture: ComponentFixture<OperatorModeComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [OperatorModeComponent]
    });
    fixture = TestBed.createComponent(OperatorModeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
