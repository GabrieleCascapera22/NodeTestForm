import { TestBed } from '@angular/core/testing';

import { CreazioneArticoloService } from './creazione-articolo.service';

describe('CreazioneArticoloService', () => {
  let service: CreazioneArticoloService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CreazioneArticoloService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
