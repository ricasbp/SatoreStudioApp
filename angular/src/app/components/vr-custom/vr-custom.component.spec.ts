import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VrCustomComponent } from './vr-custom.component';

describe('VrCustomComponent', () => {
  let component: VrCustomComponent;
  let fixture: ComponentFixture<VrCustomComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [VrCustomComponent]
    });
    fixture = TestBed.createComponent(VrCustomComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
