import { Component } from '@angular/core';
import { Option } from './components/app-select';
import { ApiService } from './services/api';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.less']
})
export class AppComponent {
  public brands: Option[] = [];

  public selectedBrands: Option[] = [];
  public selectedBrand: Option = null;

  public selectedModels: Option[] = [];
  public selectedModel: Option = null;

  public selectedYears: Option[] = [];
  public selectedYear: Option = null;

  public selectedGens: Option[] = [];
  public selectedGen: Option = null;

  constructor(private api: ApiService) {
    console.log(this);

    const yearsToOptions = (years: { [year: string]: string[] }): Option[] => {
      return Object.keys(years).map(year => ({
        title: year,
        isDisabled: Math.random() < 0.2,
        value: years[year].map(gen => (
          {
            title: gen,
            isDisabled: Math.random() < 0.2,
            value: gen
          }
        ))
      }));
    };

    this.api.getBrands().then(brands => {
      this.brands = brands.map(brand => ({
        title: brand.brand,
        isDisabled: Math.random() < 0.2,
        value: brand.models.map(model => ({
          title: model.name,
          isDisabled: Math.random() < 0.2,
          value: yearsToOptions(model.years)
        }))
      }));
    });
  }

  public changeBrand() {
    this.selectedBrand = this.selectedBrands[0] || null;
    this.selectedModels = [];
    this.changeModel();
  }

  public changeModel() {
    this.selectedModel = this.selectedModels[0] || null;
    this.selectedYears = [];
    this.changeYear();
  }

  public changeYear() {
    this.selectedYear = this.selectedYears[0] || null;
    this.selectedGens = [];
    this.changeGen();
  }

  public changeGen() {
    this.selectedGen = this.selectedGens[0] || null;
  }
}
