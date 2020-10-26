import { TestBed } from '@angular/core/testing';

import { PieceRendererService } from './piece-renderer.service';

describe('PieceRendererService', () => {
  let service: PieceRendererService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PieceRendererService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
