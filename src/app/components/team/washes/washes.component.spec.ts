import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WashesComponent } from './washes.component';

describe('WashesComponent', () => {
  let component: WashesComponent;
  let fixture: ComponentFixture<WashesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WashesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WashesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
