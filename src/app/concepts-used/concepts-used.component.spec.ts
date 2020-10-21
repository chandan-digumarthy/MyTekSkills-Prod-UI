import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConceptsUsedComponent } from './concepts-used.component';

describe('ConceptsUsedComponent', () => {
  let component: ConceptsUsedComponent;
  let fixture: ComponentFixture<ConceptsUsedComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConceptsUsedComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConceptsUsedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
