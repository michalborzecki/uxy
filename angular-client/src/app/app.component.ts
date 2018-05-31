import { Component, OnInit } from '@angular/core';
import { CategoryManager } from './service/category-manager';
import { AppState } from './service/app-state';
import { Category } from './model/category';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  public dataLoaded = false;
  public categories: Category[];
  public addCategory = false;
  public searchTerm = '';

  constructor(
    private categoryManager: CategoryManager,
    private appState: AppState,
  ) {}

  ngOnInit() {
    this.categoryManager.getAll()
      .then(categories => {
        this.appState.categories = this.categories = categories;
        this.dataLoaded = true;
      });
  }

  public onKeyNewCategory(event) {
    if (event.keyCode == 13) {
      let newCategory = new Category();
      newCategory.name = event.target.value;
      let category = this.categoryManager.create(newCategory)
      .then(category => {
        this.appState.categories.push(category);
        this.addCategory = false;
      });
    }
  };

  public onKeyCategorySearch(event) {
    this.searchTerm = event.target.value
  };

}
