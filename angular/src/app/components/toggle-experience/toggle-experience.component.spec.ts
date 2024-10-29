import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ToggleExperienceComponent } from './toggle-experience.component';

describe('ToggleExperienceComponent', () => {
  let component: ToggleExperienceComponent;
  let fixture: ComponentFixture<ToggleExperienceComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ToggleExperienceComponent]
    });
    fixture = TestBed.createComponent(ToggleExperienceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
