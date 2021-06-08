import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FixPageComponent } from './fix-page.component';

describe('FixPageComponent', () => {
  let component: FixPageComponent;
  let fixture: ComponentFixture<FixPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FixPageComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FixPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
