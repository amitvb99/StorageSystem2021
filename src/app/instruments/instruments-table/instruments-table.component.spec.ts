import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InstrumentsTableComponent } from './instruments-table.component';

describe('InstrumentsTableComponent', () => {
  let component: InstrumentsTableComponent;
  let fixture: ComponentFixture<InstrumentsTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InstrumentsTableComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InstrumentsTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
