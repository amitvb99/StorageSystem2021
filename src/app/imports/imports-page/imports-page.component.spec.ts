import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ImportsPageComponent } from './imports-page.component';

describe('ImportsPageComponent', () => {
  let component: ImportsPageComponent;
  let fixture: ComponentFixture<ImportsPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ImportsPageComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ImportsPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
