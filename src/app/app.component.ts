import {Component, OnInit} from '@angular/core';
import {fromEvent} from 'rxjs';
import {GameService} from './game/game.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  constructor(private gameService: GameService) {
  }

  ngOnInit(): void {
    fromEvent(document, 'keypress').subscribe((event: KeyboardEvent) => {
      if (event.key === 'd') {
        this.gameService.move(1);
      }
      if (event.key === 's') {
        this.gameService.crash();
      }
      if (event.key === 'q') {
        this.gameService.move(-1);
      }
      if (event.key === 'e') {
        this.gameService.pieceRotation = (this.gameService.pieceRotation + 1) % 4;
      }
      if (event.key === 'a') {
        this.gameService.pieceRotation = (this.gameService.pieceRotation - 1) % 4;
      }
    });
  }

}
