import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HierBarchartComponent } from './hier-barchart.component';

describe('HierBarchartComponent', () => {
  let component: HierBarchartComponent;
  let fixture: ComponentFixture<HierBarchartComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HierBarchartComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HierBarchartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
