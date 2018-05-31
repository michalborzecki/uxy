import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import { WordManager } from '../service/word-manager';
import { WordTranslationManager } from '../service/word-translation-manager';
import { AppState } from '../service/app-state';
import { Category } from '../model/category';
import { Word } from '../model/word';

@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.css']
})
export class CategoryComponent implements OnInit {
  public dataLoaded = false;
  public category: Category;
  public words: Word[];
  public wordsTranslationsMapping: any = {};
  public letters = [];
  public firstLetters = {};
  public searchTerm = '';

  constructor(
    private route: ActivatedRoute,
    private wordManager: WordManager,
    private wordTranslationManager: WordTranslationManager,
    private appState: AppState,
    private router: Router
) {}

  ngOnInit() {
    this.route.params.subscribe(params => {
      const categoryId = +params['categoryId'];
      this.category = this.appState.categories.filter(c => c.id === categoryId)[0];
      this.words = [];
      if (this.category) {
        this.wordManager.getAllForCategory(this.category)
          .then(words => this.words = words)
          .then(words =>
            Promise.all(words.map(word => this.wordTranslationManager.getAllForWord(word)))
              .then(wordsTranslations => {
                const translationsMapping = {};
                words.forEach((word, index) => translationsMapping[word.id] = wordsTranslations[index]);
                this.wordsTranslationsMapping = translationsMapping;
                this.letters = [];
                this.firstLetters = {};
                this.searchTerm = '';
                this.prepareLetters();
                this.prepareWords();
                this.dataLoaded = true;
              })
          );
      }
    });
  }

  private prepareLetters() {
    let firstLetters = [];

    for (let word of this.words) firstLetters.push(word.word[0].toLowerCase());
    let firstLettersSet = new Set(firstLetters);

    for (let letter of "abcdefghijklmnopqrstuvwxyz".split('')) {
      this.firstLetters[letter] = {letter: letter, words: []}
      let classes = ['letter-index-link'];
      if (firstLettersSet.has(letter)) this.letters.push({letter: letter, classes: ['letter-index-link', 'deactivated-link'], hasWord: true});
      else this.letters.push({letter: letter, classes: classes, hasWord: false})
    }
  }


  private prepareWords() {
    for (let word of this.words) this.firstLetters[word.word[0].toLowerCase()]['words'].push(word);
    this.firstLetters = Object.keys(this.firstLetters).map(function(key) {
      return {letter: key, words: this.firstLetters[key].words};
    }, this);
    console.log(this.router.url)
  }

  public onSearch(event) {
    this.searchTerm = event.target.value
  };
}
