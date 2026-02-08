import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Maguey } from './maguey';

describe('Maguey', () => {
  let component: Maguey;
  let fixture: ComponentFixture<Maguey>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Maguey]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Maguey);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
