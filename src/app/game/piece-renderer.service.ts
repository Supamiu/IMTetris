import {Injectable} from '@angular/core';
import {GridSquare} from './grid-square';

@Injectable({
  providedIn: 'root'
})
export class PieceRendererService {

  private registry: Record<string, () => number[][]> = {
    [GridSquare.O]: () => {
      return [
        [1, 1],
        [1, 1],
      ];
    },
    [GridSquare.I]: () => {
      return [
        [1],
        [1],
        [1],
        [1],
      ];
    },
    [GridSquare.J]: () => {
      return [
        [0, 1],
        [0, 1],
        [1, 1]
      ];
    },
    [GridSquare.L]: () => {
      return [
        [1, 0],
        [1, 0],
        [1, 1]
      ];
    },
    [GridSquare.S]: () => {
      return [
        [0, 1, 1],
        [1, 1, 0],
      ];
    },
    [GridSquare.Z]: () => {
      return [
        [1, 1, 0],
        [0, 1, 1],
      ];
    },
    [GridSquare.T]: () => {
      return [
        [1, 1, 1],
        [0, 1, 0],
      ];
    },
  };

  public renderPiece(piece: GridSquare, rotation: number): GridSquare[][] {
    let render = this.registry[piece]().map(row => {
      return row.map(cell => {
        return cell ? piece : GridSquare.EMPTY;
      });
    });
    for (let i = 0; i < rotation; i++) {
      render = this.rotate(render);
    }
    return render;
  }

  private rotate(render: GridSquare[][]): GridSquare[][] {
    const res = [];
    for (let x = 0; x < render[0].length; x++) {
      for (let y = 0; y < render.length; y++) {
        res[x] = res[x] || [];
        res[x][y] = render[y][x];
      }
    }
    return res;
  }
}
