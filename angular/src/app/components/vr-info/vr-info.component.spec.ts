import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VRInfoComponent } from './vr-info.component';

describe('VrInfoComponent', () => {
  let component: VRInfoComponent;
  let fixture: ComponentFixture<VRInfoComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [VRInfoComponent]
    });
    fixture = TestBed.createComponent(VRInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
