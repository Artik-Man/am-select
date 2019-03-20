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

  public selectedBrand: Option = null;
  public selectedModel: Option = null;
  public selectedYear: Option = null;
  public selectedGen: Option = null;

  public fullAutoName = '';

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
    this.selectedModel = null;
    this.changeModel();
  }

  public changeModel() {
    this.selectedYear = null;
    this.changeYear();
  }

  public changeYear() {
    this.selectedGen = null;
    this.changeGen();
  }

  public changeGen() {
    this.updateAutoName();
  }

  public writeName() {
    const words = this.fullAutoName.replace(/\s+/g, ' ').toLowerCase().split(' ');

    const brand = words.shift();
    if (!brand) { return; }
    const foundBrand = this.brands.find(b => b.title.toLowerCase().indexOf(brand) === 0);
    if (!foundBrand) { return; }
    this.selectedBrand = foundBrand;

    const model = words.shift();
    if (!model) { return; }
    const foundModel = this.selectedBrand.value.find(b => b.title.toLowerCase().indexOf(model) === 0);
    if (!foundModel) { return; }
    this.selectedModel = foundModel;

    const gen = words.shift();
    if (!gen) { return; }
    let foundYears;
    let foundGen;
    for (const year of this.selectedModel.value) {
      for (const generation of year.value) {
        if (generation.title.toLowerCase().indexOf(gen) !== -1) {
          foundYears = year;
          foundGen = generation;
          break;
        }
      }
    }
    if (!foundYears || !foundGen) { return; }
    this.selectedYear = foundYears;
    this.selectedGen = foundGen;
    this.updateAutoName();
  }

  private updateAutoName() {
    const title = [];
    if (this.selectedBrand) {
      title.push(this.selectedBrand.title);
    }
    if (this.selectedModel) {
      title.push(this.selectedModel.title);
    }
    // if (this.selectedYear) {
    //   title.push(this.selectedYear.title);
    // }
    if (this.selectedGen) {
      title.push(this.selectedGen.title);
    }
    this.fullAutoName = title.join(' ');
  }
}
