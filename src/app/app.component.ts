import { Component } from '@angular/core';
import { Option } from './components/app-select';
import { ApiService } from './services/api';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.less']
})
export class AppComponent {
  public title = 'am-select';
  public brands: Option[] = [];
  public selectedBrand: Option[] = [];
  constructor(private api: ApiService) {
    console.log(this);

    this.api.getBrands().then(brands => {
      this.brands = brands.map(brand => ({
        value: brand.models,
        title: brand.brand,
        isDisabled: Math.random() < 0.2
      }));
    });
  }

  public changeBrand() {
    // this.selectedBrand
    console.log(this.selectedBrand);

  }
}
