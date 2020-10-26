import {GridSquare} from './grid-square';

export class Grid {
  public grid: GridSquare[][];

  constructor() {
    this.reset();
  }

  reset(): void {
    this.grid = JSON.parse(JSON.stringify(new Array(20).fill(new Array(10).fill(GridSquare.EMPTY))));
  }

  public merge(other: Grid): Grid {
    const res = new Grid();
    this.grid.forEach((row, y) => {
      row.forEach((cell, x) => {
        if (other.grid[y][x] !== GridSquare.EMPTY && this.grid[y][x] !== GridSquare.EMPTY) {
          throw new Error(`Cell conflict at X:${x} Y:${y}`);
        }
        res.grid[y][x] = this.grid[y][x] === GridSquare.EMPTY ? other.grid[y][x] : this.grid[y][x];
      });
    });
    return res;
  }
}
