import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ForceDisjointComponent } from './force-disjoint.component';

describe('ForceDisjointComponent', () => {
  let component: ForceDisjointComponent;
  let fixture: ComponentFixture<ForceDisjointComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ForceDisjointComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ForceDisjointComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
