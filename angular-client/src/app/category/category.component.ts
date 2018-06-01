import {Component, enableProdMode, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {WordManager} from '../service/word-manager';
import {WordTranslationManager} from '../service/word-translation-manager';
import {AppState} from '../service/app-state';
import {Category} from '../model/category';
import {Word} from '../model/word';
import {CategoryManager} from "../service/category-manager";
import {BsModalRef, BsModalService} from "ngx-bootstrap";
import {ModalContentComponent} from "../modal-content.component";


enableProdMode();

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
  public selectedWords = 0;
  public selectBox = false;
  public allWordsOption = {type: '1', text: 'Wybierz wszystkie'};
  public hardWordsOption = {type: '2', text: 'Wybierz trudne'};
  public chosenOption = {type: '1', text: 'Wybierz wszystkie'};
  public hardWords = [];
  public editMode = false;
  public modalRef: BsModalRef;
  public categoryId = NaN;


  constructor(private route: ActivatedRoute,
              private wordManager: WordManager,
              private wordTranslationManager: WordTranslationManager,
              private appState: AppState,
              private router: Router,
              private categoryManager: CategoryManager,
              private modalService: BsModalService,
  ) {}

  ngOnInit() {
    this.route.params.subscribe(params => {
      // document.getElementById('search-word').value = '';
      this.selectedWords = 0;
      this.selectBox = false;
      this.editMode = false;
      const categoryId = +params['categoryId'];
      this.categoryId = categoryId;
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
                this.prepareLetters();
                this.prepareWords();
                this.dataLoaded = true;
              })
          );
      } else {
        this.category = new Category();
        this.category.name = 'Wszystkie słówka';
        this.wordManager.getAllWords()
          .then(words => this.words = words)
          .then(words =>
            Promise.all(words.map(word => this.wordTranslationManager.getAllForWord(word)))
              .then(wordsTranslations => {
                const translationsMapping = {};
                words.forEach((word, index) => translationsMapping[word.id] = wordsTranslations[index]);
                this.wordsTranslationsMapping = translationsMapping;
                this.letters = [];
                this.firstLetters = {};
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
      if (firstLettersSet.has(letter)) this.letters.push({
        letter: letter,
        classes: ['letter-index-link', 'deactivated-link'],
        hasWord: true
      });
      else this.letters.push({letter: letter, classes: classes, hasWord: false})
    }
  }


  private prepareWords() {
    for (let word of this.words) {
      word['selected'] = false;
      word['shouldBeDisplayed'] = true;
      this.firstLetters[word.word[0].toLowerCase()]['words'].push(word);
    }
    this.firstLetters = Object.keys(this.firstLetters).map(function (key) {
      return {shouldBeDisplayed: true, letter: key, words: this.firstLetters[key].words};
    }, this);

    Promise.all([
      this.wordManager.getHardWords(10),
    ]).then(([hard]) => {
      this.hardWords = hard;
    });
  }

  public onSearch(event) {
    let searchTerm = event.target.value;
    for (let letter of Object.keys(this.firstLetters)) {
      let shouldBeDisplayedCategory = false;
      for (let word of this.firstLetters[letter].words) {
        if (word.word.toLowerCase().includes(searchTerm.toLowerCase())) {
          word.shouldBeDisplayed = true;
          shouldBeDisplayedCategory = true;
        }
      }
      this.firstLetters[letter].shouldBeDisplayed = shouldBeDisplayedCategory;
    }

  };

  public selectWord(event, word) {
    event.stopPropagation()
    if (!word.selected) this.selectedWords += 1;
    else this.selectedWords -= 1;
    word.selected = !word.selected;
  };

  public chooseOption(option) {
    this.chosenOption = option;
    for (let word of this.words) word['selected'] = false;
    this.selectBox = false;
    this.selectedWords = 0;
    if (option.type === '1') {
      for (let word of this.words) {
        word['selected'] = true;
        this.selectedWords += 1;
      }
    }
    else {
      for (let word of this.words) {
        for (let hardWord of this.hardWords) {
          if (word.id == hardWord.id) {
            word['selected'] = true;
            this.selectedWords += 1;
          }
        }
      }
    }
  };

  public deleteCategory() {
    this.modalRef = this.modalService.show(ModalContentComponent);
    this.modalRef.content.title = "Uwaga!";
    window.scrollTo(0, 0)
    this.modalRef.content.body = "Czy na pewno chcesz usunąć kategorię \"" + this.category.name + "\"?";
    this.modalRef.content.onReject = this.onDeleteReject;
    this.modalRef.content.onConfirm= this.onDeleteCategoryConfirm.bind(this);

  };

  public onDeleteCategoryConfirm() {
    document.getElementById('modal-element').remove()

    let categoryId = this.router.url.split('/')[2];
    let newCategory = new Category();
    newCategory.id = Number(categoryId);

    this.categoryManager.delete(newCategory)
      .then(_ => {
          this.router.navigateByUrl('/home');
          this.appState.categories = this.appState.categories.filter(function (el) {
            return el.id != Number(categoryId);
          });
        }
      );
  }

  public onUpdate(event) {
    if (event.keyCode == 13) {
      let categoryId = this.router.url.split('/')[2];
      let categoryToUpdate = this.appState.categories.filter(function (el) {
        return el.id == Number(categoryId);
      })[0];
      categoryToUpdate.name = event.target.value;
      this.categoryManager.update(categoryToUpdate);
      this.editMode = false;
    }
  };

  public deleteWords() {
    if (this.selectedWords == 0) return;

    this.modalRef = this.modalService.show(ModalContentComponent);
    this.modalRef.content.title = "Uwaga!";
    window.scrollTo(0, 0)
    this.modalRef.content.body = "Czy na pewno chcesz usunąć wybrane słówka?";
    this.modalRef.content.onReject = this.onDeleteReject;
    this.modalRef.content.onConfirm= this.onDeleteWordsConfirm.bind(this);

  };



  public onDeleteReject() {
    document.getElementById('modal-element').remove()
  }

  public onDeleteWordsConfirm() {
    document.getElementById('modal-element').remove()
    this.selectedWords = 0;

    for (let letter of Object.keys(this.firstLetters)) {
      let toDelete = [];
      for (let w of this.firstLetters[letter].words.map((word, index) => ({word, index}))) {
        if (w.word.selected) {
          let wordToDelete = new Word();
          wordToDelete.id = w.word.id;
          this.wordManager.delete(wordToDelete)
            .then(_ =>
            {toDelete.push(w.index);}
            ).then(_ => {
              for (let index of toDelete) {
                this.firstLetters[letter].words.splice(index, 1);
                if (this.firstLetters[letter].words.length < 1) {
                  for (let l of this.letters) {
                    if (l.letter == this.firstLetters[letter].letter) l.hasWord = false;
                  }
                }
              }
              this.categoryManager.getAll()
                .then(categories => {
                  this.appState.categories = categories;
                });
            })
        }
      }
    }
  }
}
