import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TekStackComponent } from './tek-stack.component';

describe('TekStackComponent', () => {
  let component: TekStackComponent;
  let fixture: ComponentFixture<TekStackComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TekStackComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TekStackComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
