import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Destilados } from './destilados';

describe('Destilados', () => {
  let component: Destilados;
  let fixture: ComponentFixture<Destilados>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Destilados]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Destilados);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
