import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpModule } from '@angular/http';
import { ChartistModule } from 'ng-chartist'

import { AppComponent } from './app.component';
import { CategoryManager } from './service/category-manager';
import { WordManager } from './service/word-manager';
import { WordTranslationManager } from './service/word-translation-manager';
import { AppState } from './service/app-state';
import { CategoryComponent } from './category/category.component';
import { HomeComponent } from './home/home.component';
import { routing } from './app.routes';
import { WordComponent } from './word/word.component';
import { FormsModule } from '@angular/forms';
import { ModalModule } from 'ngx-bootstrap/modal';
import {ModalContentComponent} from "./modal-content.component";
import { LearnChartComponent } from './learn-chart/learn-chart.component';

@NgModule({
  declarations: [
    AppComponent,
    CategoryComponent,
    HomeComponent,
    WordComponent,
    ModalContentComponent,
    LearnChartComponent,
  ],
  entryComponents: [ModalContentComponent],
  imports: [
    HttpModule,
    BrowserModule,
    routing,
    FormsModule,
    ModalModule.forRoot(),
    ChartistModule,
  ],
  providers: [
    CategoryManager,
    WordManager,
    WordTranslationManager,
    AppState,
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
