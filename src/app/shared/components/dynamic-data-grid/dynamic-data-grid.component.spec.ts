import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DynamicDataGridComponent } from './dynamic-data-grid.component';

describe('DynamicDataGridComponent', () => {
  let component: DynamicDataGridComponent;
  let fixture: ComponentFixture<DynamicDataGridComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DynamicDataGridComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DynamicDataGridComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
