import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EspacioDetailComponent } from './espacio-detail.component';

describe('EspacioDetailComponent', () => {
  let component: EspacioDetailComponent;
  let fixture: ComponentFixture<EspacioDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EspacioDetailComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EspacioDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
