import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FixesTableComponent } from './fixes-table.component';

describe('FixesTableComponent', () => {
  let component: FixesTableComponent;
  let fixture: ComponentFixture<FixesTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FixesTableComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FixesTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
