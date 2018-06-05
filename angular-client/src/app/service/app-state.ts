import {Injectable} from '@angular/core';
import {Category} from '../model/category';
import {Observable, BehaviorSubject} from 'rxjs';

@Injectable()
export class AppState {
  categoriesSubject: BehaviorSubject<Category[]> = new BehaviorSubject(undefined);

  get categories(): Category[] {
    return this.categoriesSubject.getValue();
  }

  set categories(categories: Category[]) {
    this.categoriesSubject.next(categories);
  }

  get categoriesObservable(): Observable<Category[]> {
    return this.categoriesSubject.asObservable();
  }
}
