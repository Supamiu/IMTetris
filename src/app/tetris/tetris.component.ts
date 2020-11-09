import {Component, OnInit} from '@angular/core';
import {GameService} from '../game/game.service';
import {PieceRendererService} from '../game/piece-renderer.service';
import {GridSquare} from '../game/grid-square';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';

@Component({
  selector: 'app-tetris',
  templateUrl: './tetris.component.html',
  styleUrls: ['./tetris.component.scss']
})
export class TetrisComponent implements OnInit {

  public grid$: Observable<GridSquare[][]>;

  public nextPieceGrid$: Observable<GridSquare[][]> = this.gameService.nextPiece$.pipe(
    map(piece => {
      return this.pieceRenderer.renderPiece(piece, 0);
    })
  );

  public points$ = this.gameService.points$;

  constructor(private gameService: GameService, private pieceRenderer: PieceRendererService) {
  }

  ngOnInit(): void {
    this.gameService.start();
    this.grid$ = this.gameService.display$;
  }

}
