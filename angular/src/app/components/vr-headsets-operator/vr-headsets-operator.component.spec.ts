import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VrHeadsetsOperatorComponent } from './vr-headsets-operator.component';

describe('VrHeadsetsOperatorComponent', () => {
  let component: VrHeadsetsOperatorComponent;
  let fixture: ComponentFixture<VrHeadsetsOperatorComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [VrHeadsetsOperatorComponent]
    });
    fixture = TestBed.createComponent(VrHeadsetsOperatorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
