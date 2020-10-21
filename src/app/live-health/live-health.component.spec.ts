import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LiveHealthComponent } from './live-health.component';

describe('LiveHealthComponent', () => {
  let component: LiveHealthComponent;
  let fixture: ComponentFixture<LiveHealthComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LiveHealthComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LiveHealthComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
