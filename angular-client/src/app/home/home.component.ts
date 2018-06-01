import { Component, OnInit } from '@angular/core';
import { WordManager } from '../service/word-manager';
import { AppState } from '../service/app-state';
import { Word } from '../model/word';
import { Category } from '../model/category';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  public lastWords: Word[];
  public hardWords: Word[];
  public categories: Category[];
  public loadedData = false;

  constructor(
    private wordManager: WordManager,
    private appState: AppState,
  ) { }

  ngOnInit() {
    this.categories = this.appState.categories;
    Promise.all([
      this.wordManager.getHardWords(5),
      this.wordManager.getLastWords(5),
    ])
    .then(([hard, last]) => {
      this.hardWords = hard;
      this.lastWords = last;
      this.loadedData = true;
    });
  }

  /**
   * It is only a mock of proper words reset for presentation purposes.
   * Backend does not support words reset.
   */
  public resetHardWords() {
    this.hardWords = [];
  }
}
