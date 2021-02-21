import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoansTestComponent } from './loans-test.component';

describe('LoansTestComponent', () => {
  let component: LoansTestComponent;
  let fixture: ComponentFixture<LoansTestComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LoansTestComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LoansTestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
