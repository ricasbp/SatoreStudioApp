import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddVRHeadsetComponent } from './add-vrheadset.component';

describe('AddVRHeadsetComponent', () => {
  let component: AddVRHeadsetComponent;
  let fixture: ComponentFixture<AddVRHeadsetComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AddVRHeadsetComponent]
    });
    fixture = TestBed.createComponent(AddVRHeadsetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
