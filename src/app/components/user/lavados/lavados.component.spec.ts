import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LavadosComponent } from './lavados.component';

describe('LavadosComponent', () => {
  let component: LavadosComponent;
  let fixture: ComponentFixture<LavadosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LavadosComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LavadosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
