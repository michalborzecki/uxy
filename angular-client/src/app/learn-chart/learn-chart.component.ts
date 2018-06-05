import { Component, OnInit, OnChanges, Input, SimpleChanges } from '@angular/core';
import { Category } from '../model/category';
import * as Chartist from 'chartist';

@Component({
  selector: 'app-learn-chart',
  templateUrl: './learn-chart.component.html',
  styleUrls: ['./learn-chart.component.css']
})
export class LearnChartComponent implements OnInit, OnChanges {

  @Input() categories: Category[];

  public chartData: any;
  public chartOptions: any;

  constructor() { }

  ngOnInit() {
    const ticks = [];
    for (let i = 0; i < 11; i++) {
      ticks.push(i * 0.1);
    }
    this.chartOptions = {
      stackBars: true,
      axisY: {
        type: Chartist.FixedScaleAxis,
        low: 0,
        high: 1,
        ticks,
        labelInterpolationFnc: function (value) {
          return Math.round(value * 100) + '%';
        },
        labelOffset: {
          x: 5,
          y: 15,
        }
      },
    };
  }

  ngOnChanges(changes: SimpleChanges) {
    const processedCategories = this.categories.map(category => ({
      name: category.name,
      learnedWordsThisWeek: (category.learnedWordsThisWeek || 0) / (category.words.length || 1),
      learnedWordsBeforeThisWeek: (category.learnedWordsBeforeThisWeek || 0) / (category.words.length || 1),
    })).sort((a, b) =>
      b.learnedWordsThisWeek + b.learnedWordsBeforeThisWeek -
      (a.learnedWordsThisWeek + a.learnedWordsBeforeThisWeek)
    ).slice(0, 5);
    
    this.chartData = {
      labels: processedCategories.map(c => c.name),
      series: [
        processedCategories.map(c => c.learnedWordsBeforeThisWeek),
        processedCategories.map(c => c.learnedWordsThisWeek),
      ],
    };
  }
}
