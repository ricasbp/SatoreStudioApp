import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VrHeadsetsDirectorComponent } from './vr-headsets-director.component';

describe('VrHeadsetsDirectorComponent', () => {
  let component: VrHeadsetsDirectorComponent;
  let fixture: ComponentFixture<VrHeadsetsDirectorComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [VrHeadsetsDirectorComponent]
    });
    fixture = TestBed.createComponent(VrHeadsetsDirectorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
