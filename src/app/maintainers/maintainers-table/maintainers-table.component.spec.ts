import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MaintainersTableComponent } from './maintainers-table.component';

describe('MaintainersTableComponent', () => {
  let component: MaintainersTableComponent;
  let fixture: ComponentFixture<MaintainersTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MaintainersTableComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MaintainersTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
