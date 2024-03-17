import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreazioneArticoloComponent } from './creazione-articolo.component';

describe('CreazioneArticoloComponent', () => {
  let component: CreazioneArticoloComponent;
  let fixture: ComponentFixture<CreazioneArticoloComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreazioneArticoloComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreazioneArticoloComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
