import {Injectable} from '@angular/core';
import {GridSquare} from './grid-square';
import {Grid} from './grid';
import {PieceRendererService} from './piece-renderer.service';
import {BehaviorSubject, ReplaySubject} from 'rxjs';
import {Router} from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class GameService {
  private interval: any;

  private static POSSIBLE_PIECES = [
    GridSquare.O,
    GridSquare.I,
    GridSquare.L,
    GridSquare.J,
    GridSquare.Z,
    GridSquare.S,
    GridSquare.T,
  ];

  private _staticGrid = new Grid();

  private _dynamicGrid = new Grid();

  public display$ = new ReplaySubject<GridSquare[][]>();

  public points$ = new BehaviorSubject(0);

  public piece: GridSquare;

  public pieceCoords = {
    x: 4,
    y: 0
  };

  public pieceRotation: number = 0;

  public nextPiece$ = new BehaviorSubject<GridSquare>(this.getRandomPiece());

  constructor(private renderer: PieceRendererService, private router: Router) {
    this.piece = this.getRandomPiece();
  }

  public move(direction: 1 | -1): void {
    const backup = this.pieceCoords.x;
    const pieceRender = this.renderer.renderPiece(this.piece, this.pieceRotation);
    this.pieceCoords.x += direction;
    if (this.pieceCoords.x < 0 || this.pieceCoords.x + pieceRender[0].length > 10) {
      this.pieceCoords.x = backup;
    }
    this.tick(true);
  }

  public crash(): void {
    this.pieceCoords.y++;
    this.tick(true);
  }

  private tick(fromInput = false): void {
    const previousDynamicGrid = new Grid().merge(this._dynamicGrid);
    try {
      if (!fromInput) {
        this.pieceCoords.y++;
      }
      this.renderPieceInDynamicGrid();
      this.display$.next(this._staticGrid.merge(this._dynamicGrid).grid);
    } catch (e) {
      console.error(e);
      try {
        if (fromInput) {
          this._dynamicGrid = previousDynamicGrid;
          this.display$.next(this._staticGrid.merge(this._dynamicGrid).grid);
        }
        this._staticGrid = this._staticGrid.merge(previousDynamicGrid);
        this.pieceCoords = {
          x: 4,
          y: 0
        };
        this.generateNextPiece();
      } catch (_) {
        clearInterval(this.interval);
        delete this.interval;
        alert('Game Over');
        this._staticGrid = new Grid();
        this.router.navigateByUrl('/');
      }
    }

    if (this._staticGrid.grid[this._staticGrid.grid.length - 1].every(cell => cell !== GridSquare.EMPTY)) {
      this._staticGrid.grid.pop();
      this._staticGrid.grid.unshift(JSON.parse(JSON.stringify(new Array(10).fill(GridSquare.EMPTY))));
      this.points$.next(this.points$.value + 1000);
    }
  }

  private renderPieceInDynamicGrid(): void {
    this._dynamicGrid.reset();
    this.renderer.renderPiece(this.piece, this.pieceRotation).forEach((row, y) => {
      row.forEach((cell, x) => {
        this._dynamicGrid.grid[this.pieceCoords.y + y][this.pieceCoords.x + x] = cell;
      });
    });
  }

  private generateNextPiece(): void {
    this.piece = this.nextPiece$.value;
    this.nextPiece$.next(this.getRandomPiece());
  }

  private getRandomPiece(): GridSquare {
    return GameService.POSSIBLE_PIECES[Math.floor(Math.random() * GameService.POSSIBLE_PIECES.length)];
  }

  public start(): void {
    this.interval = setInterval(() => {
      this.tick();
    }, 1000);
    this.tick();
  }
}
