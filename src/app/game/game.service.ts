import {Injectable} from '@angular/core';
import {GridSquare} from './grid-square';
import {Grid} from './grid';
import {PieceRendererService} from './piece-renderer.service';
import {BehaviorSubject, interval, merge, Observable, Subject} from 'rxjs';
import {Router} from '@angular/router';
import {map, takeUntil} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class GameService {

  private interval$: Observable<number>;

  private stop$ = new Subject<void>();

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

  public display$: Observable<GridSquare[][]>;

  public points$ = new BehaviorSubject(0);

  public piece: GridSquare;

  private refresh$ = new Subject<void>();

  public pieceCoords = {
    x: 4,
    y: 0
  };

  public pieceRotation = 0;

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
    this.refresh$.next();
  }

  public crash(): void {
    this.pieceCoords.y++;
    this.refresh$.next();
  }

  private tick(fromInput): GridSquare[][] {
    const previousDynamicGrid = new Grid().merge(this._dynamicGrid);
    try {
      if (!fromInput) {
        this.pieceCoords.y++;
      }
      this.renderPieceInDynamicGrid();
      return this._staticGrid.merge(this._dynamicGrid).grid;
    } catch (e) {
      console.error(e);
      try {
        if (fromInput) {
          this._dynamicGrid = previousDynamicGrid;
          return this._staticGrid.merge(this._dynamicGrid).grid;
        }
        this._staticGrid = this._staticGrid.merge(previousDynamicGrid);
        this.pieceCoords = {
          x: 4,
          y: 0
        };
        this.generateNextPiece();
      } catch (_) {
        this.stop();
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

  public stop(): void {
    this.stop$.next();
  }

  public start(): void {
    this.interval$ = interval(1000).pipe(
      takeUntil(this.stop$)
    );
    this.display$ = merge(this.interval$, this.refresh$).pipe(
      map((value) => {
        return this.tick(value === undefined);
      })
    );
  }
}
