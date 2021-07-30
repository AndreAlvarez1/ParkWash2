import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DecardComponent } from './decard.component';

describe('DecardComponent', () => {
  let component: DecardComponent;
  let fixture: ComponentFixture<DecardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DecardComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DecardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
