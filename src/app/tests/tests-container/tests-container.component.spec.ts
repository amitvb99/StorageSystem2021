import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TestsContainerComponent } from './tests-container.component';

describe('TestsContainerComponent', () => {
  let component: TestsContainerComponent;
  let fixture: ComponentFixture<TestsContainerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TestsContainerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TestsContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
