import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VrInfoComponent } from './vr-info.component';

describe('VrInfoComponent', () => {
  let component: VrInfoComponent;
  let fixture: ComponentFixture<VrInfoComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [VrInfoComponent]
    });
    fixture = TestBed.createComponent(VrInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
