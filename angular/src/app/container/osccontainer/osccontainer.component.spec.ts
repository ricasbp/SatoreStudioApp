import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OSCContainerComponent } from './osccontainer.component';

describe('OSCContainerComponent', () => {
  let component: OSCContainerComponent;
  let fixture: ComponentFixture<OSCContainerComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [OSCContainerComponent]
    });
    fixture = TestBed.createComponent(OSCContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
