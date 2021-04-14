import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InstrumentPageComponent } from './instrument-page.component';

describe('InstrumentPageComponent', () => {
  let component: InstrumentPageComponent;
  let fixture: ComponentFixture<InstrumentPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InstrumentPageComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InstrumentPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
