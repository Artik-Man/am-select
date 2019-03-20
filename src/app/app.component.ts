import { Component } from '@angular/core';
import { Option } from './components/app-select';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.less']
})
export class AppComponent {
  public title = 'am-select';
  public brands: Option[] = [];
  public selectedBrand: Option[] = [];
  constructor() {
    console.log(this);
    this.brands = ['Tesla', 'Audi', 'Lamborghini', 'Toyota', 'BMW', 'Volkswagen'].sort()
      .map(item => ({
        value: {},
        title: item,
        isDisabled: Math.random() < 0.2
      }));
  }
}
