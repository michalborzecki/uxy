import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import { WordManager } from '../service/word-manager';
import { WordTranslationManager } from '../service/word-translation-manager';
import { AppState } from '../service/app-state';
import { Category } from '../model/category';
import { Word } from '../model/word';
import { WordTranslation } from '../model/word-translation';
import {CategoryManager} from "../service/category-manager";
import {ModalContentComponent} from "../modal-content.component";
import {BsModalRef, BsModalService} from "ngx-bootstrap";

@Component({
  selector: 'app-word',
  templateUrl: './word.component.html',
  styleUrls: ['./word.component.css']
})
export class WordComponent implements OnInit {
  public dataLoaded = false;
  public word: Word;
  public wordCategories: Category[];
  public wordTranslations: WordTranslation[];
  public editMode = false;
  public modalRef: BsModalRef;
  public addMode = false;
  public wordAddMode = false;
  public translationToAdd = new WordTranslation();

  constructor(
    private route: ActivatedRoute,
    private wordManager: WordManager,
    private wordTranslationManager: WordTranslationManager,
    private appState: AppState,
    private router: Router,
    private categoryManager: CategoryManager,
    private modalService: BsModalService,
  ) {}

  ngOnInit() {
    this.route.params.subscribe(params => {
      const wordId = +params['wordId'];
      this.word = null;
      this.wordCategories = [];
      this.wordTranslations = [];
      this.wordManager.getById(wordId).then((word) => {
        this.word = word;
        this.dataLoaded = true;
        this.translationToAdd.domain = 'dziedzina';
        this.translationToAdd.word = 'słówko (polski)';
        this.translationToAdd.wordTranslation = 'tłumaczenie (angielski)';
        this.translationToAdd.example = 'przykładowe zdanie (polski)';
        this.translationToAdd.exampleTranslation = 'przykładowe zdanie (angielski)';
        this.wordCategories = this.appState.categories
          .filter(category => word.categories.indexOf(category.id) !== -1);
        this.wordTranslationManager.getAllForWord(word)
          .then(translations => this.wordTranslations = translations);
      });
    });
  }

  public deleteWord() {
    this.modalRef = this.modalService.show(ModalContentComponent);
    this.modalRef.content.title = "Uwaga!";
    window.scrollTo(0, 0)
    this.modalRef.content.body = "Czy na pewno chcesz usunąć słówko \"" + this.word.word + "\"?";
    this.modalRef.content.onReject = this.onDeleteReject;
    this.modalRef.content.onConfirm= this.onDeleteConfirm.bind(this);
  }

  public onDeleteReject() {
    document.getElementById('modal-element').remove()
  }

  public onDeleteConfirm() {
    document.getElementById('modal-element').remove()

    let wordToDelete = new Word();
    wordToDelete.id = Number(this.word.id);

    this.wordManager.delete(wordToDelete)
      .then(_ => {
          this.categoryManager.getAll()
            .then(categories => {
              this.appState.categories = categories;
            });
          this.router.navigateByUrl('/home');
        }
      );
  }


  public onUpdate(event) {
    if (event.keyCode == 13) {
      this.word.word = event.target.value;
      this.wordManager.update(this.word);
      this.editMode = false;
    }
  };

  public addCategory(categoryToAdd) {
    this.addMode = false;
    var set = new Set(this.word.categories);
    if (set.has(categoryToAdd.id)) return;

    this.wordCategories.push(categoryToAdd);
    this.word.categories.push(categoryToAdd.id);
    this.wordManager.update(this.word).then(word => {
      this.word = word;
      this.categoryManager.getAll()
        .then(categories => {
          this.appState.categories = categories;
        });
    });
  };

  public onRemoveCategory(categoryToRemove) {
    this.modalRef = this.modalService.show(ModalContentComponent);
    this.modalRef.content.title = "Uwaga!";
    window.scrollTo(0, 0);
    this.modalRef.content.body = "Czy na pewno chcesz usunąć słówko \"" + this.word.word + "\" z kategorii \"" + categoryToRemove.name + "\"?";
    this.modalRef.content.onReject = this.onDeleteReject;
    this.modalRef.content.onConfirm = this.onDeleteCategoryConfirm.bind(this, categoryToRemove);


  }

  public onDeleteCategoryConfirm(categoryToRemove) {
    document.getElementById('modal-element').remove()

    var index = this.wordCategories.indexOf(categoryToRemove, 0);
    if (index > -1) {
      this.wordCategories.splice(index, 1);
    }
    index = this.word.categories.indexOf(categoryToRemove.id, 0);
    if (index > -1) {
      this.word.categories.splice(index, 1);
    }
    this.wordManager.update(this.word).then(word => {
      this.word = word;
      this.categoryManager.getAll()
        .then(categories => {
          this.appState.categories = categories;
        });
    });
  }

}
