import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DirectorModeComponent } from './director-mode.component';

describe('DirectorModeComponent', () => {
  let component: DirectorModeComponent;
  let fixture: ComponentFixture<DirectorModeComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DirectorModeComponent]
    });
    fixture = TestBed.createComponent(DirectorModeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
