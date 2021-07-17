import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CarsAdminComponent } from './cars-admin.component';

describe('CarsAdminComponent', () => {
  let component: CarsAdminComponent;
  let fixture: ComponentFixture<CarsAdminComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CarsAdminComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CarsAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
