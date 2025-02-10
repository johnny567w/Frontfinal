import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EspacioListComponent } from './espacio-list.component';

describe('EspacioListComponent', () => {
  let component: EspacioListComponent;
  let fixture: ComponentFixture<EspacioListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EspacioListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EspacioListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
