import { TestBed } from '@angular/core/testing';

import { MiPerfilService } from './mi-perfil.service';

describe('MiPerfilService', () => {
  let service: MiPerfilService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MiPerfilService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
