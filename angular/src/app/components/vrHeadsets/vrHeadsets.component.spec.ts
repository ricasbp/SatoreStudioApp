import { ComponentFixture, TestBed } from '@angular/core/testing';

import { vrHeadsetsComponent } from './vrHeadsets.component';

describe('VrInfoComponent', () => {
  let component: vrHeadsetsComponent;
  let fixture: ComponentFixture<vrHeadsetsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [vrHeadsetsComponent]
    });
    fixture = TestBed.createComponent(vrHeadsetsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
