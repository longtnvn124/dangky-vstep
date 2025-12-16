import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TraCuuKetQuaComponent } from './tra-cuu-ket-qua.component';

describe('TraCuuKetQuaComponent', () => {
  let component: TraCuuKetQuaComponent;
  let fixture: ComponentFixture<TraCuuKetQuaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TraCuuKetQuaComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TraCuuKetQuaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
