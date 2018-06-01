import {Injectable} from '@angular/core';
import {Category} from '../model/category';
import Configuration from '../configuration';
import {Http} from '@angular/http';

@Injectable()
export class CategoryManager {
  constructor(private http: Http) {}

  getAllIds(): Promise<number[]> {
    return this.http.get(Configuration.backendUrl + '/categories')
      .toPromise()
      .then(respone => respone.json());
  }

  getAll(): Promise<Category[]> {
    return this.getAllIds()
      .then(ids =>
        Promise.all(ids.map(id =>
          this.http.get(Configuration.backendUrl + '/categories/' + id)
            .toPromise()
            .then(response => response.json())
        )).then(categories => {
          categories = categories.sort((a, b) => {
            if (a.name < b.name) return -1;
            else if (a.name > b.name) return 1;
            else return 0;
          });
          return categories;
        })
      );
  }

  create(category: Category): Promise<Category> {
    return this.http.post(Configuration.backendUrl + '/categories', category)
      .toPromise()
      .then(response => response.json());
  }

  update(category: Category): Promise<Category> {
    return this.http.put(Configuration.backendUrl + '/categories/' + category.id, category)
      .toPromise()
      .then(response => response.json());
  }

  delete(category: Category): Promise<void> {
    return this.http.delete(Configuration.backendUrl + '/categories/' + category.id)
      .toPromise()
      .then(response => null);
  }
}
