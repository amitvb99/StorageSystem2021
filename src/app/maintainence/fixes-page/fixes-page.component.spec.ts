import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FixesPageComponent } from './fixes-page.component';

describe('FixesPageComponent', () => {
  let component: FixesPageComponent;
  let fixture: ComponentFixture<FixesPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FixesPageComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FixesPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
