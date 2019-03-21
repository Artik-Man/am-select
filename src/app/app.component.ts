import { Component } from '@angular/core';
import { Option } from './components/app-select';
import { ApiService } from './services/api';
import { FormGroup, FormControl } from '@angular/forms';
import { merge } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.less']
})
export class AppComponent {
  public brands: Option[] = [];
  public form: FormGroup;

  constructor(
    private api: ApiService
  ) {
    console.log(this);

    this.form = this.buildFormWithSubscriptions();

    this.getBrandsFromAPI(brands => {
      this.brands = brands;
      this.form.get('selectedBrand').enable();
    });
  }

  /**
   * @param controlName - имя контрола, варианты опций которого мы должны получить
   * @returns Option[] - список опций
   */
  public getOptions(controlName: string): Option[] {
    const control = this.form.get(controlName);
    if (!control || !control.value) { return []; }
    return control.value.value || [];
  }

  /**
   * Создаёт форму с динамической подпиской элементов форм друг на друга
   */
  private buildFormWithSubscriptions(): FormGroup {
    const fullAutoName = new FormControl('');
    const selectedBrand = new FormControl({ value: null, disabled: true });
    const selectedModel = new FormControl({ value: null, disabled: true });
    const selectedYear = new FormControl({ value: null, disabled: true });
    const selectedGen = new FormControl({ value: null, disabled: true });

    const dynSubs = {
      subs: {
        text: null,
        selects: null,
      },
      subscriptionOnSelects: () => {
        return merge(
          selectedBrand.valueChanges,
          selectedModel.valueChanges,
          selectedYear.valueChanges,
          selectedGen.valueChanges
        ).subscribe(some => {
          dynSubs.subs.text && dynSubs.subs.text.unsubscribe();
          fullAutoName.setValue(this.updateAutoName());
          dynSubs.subs.text = dynSubs.subscriptionOnText();
        });
      },
      subscriptionOnText: () => {
        return fullAutoName.valueChanges
          .subscribe((text: string) => {
            dynSubs.subs.selects && dynSubs.subs.selects.unsubscribe();
            this.updateOptions(text);
            dynSubs.subs.selects = dynSubs.subscriptionOnSelects();
          });
      }
    };

    dynSubs.subs.selects = dynSubs.subscriptionOnSelects();
    dynSubs.subs.text = dynSubs.subscriptionOnText();

    selectedBrand.valueChanges.subscribe((brand: Option) => {
      selectedModel.reset();
      selectedModel[brand ? 'enable' : 'disable']();
    });

    selectedModel.valueChanges.subscribe((model: Option) => {
      selectedYear.reset();
      selectedYear[model ? 'enable' : 'disable']();
    });

    selectedYear.valueChanges.subscribe((year: Option) => {
      selectedGen.reset();
      selectedGen[year ? 'enable' : 'disable']();
    });

    return new FormGroup({
      fullAutoName,
      selectedBrand,
      selectedModel,
      selectedYear,
      selectedGen
    });
  }
  /**
   * Получает список доступных брендов
   * @param callback - коллбэк со списком доступных брендов автомобилей
   */
  private getBrandsFromAPI(callback: (brands: Option[]) => void) {
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
      const out = brands.map(brand => ({
        title: brand.brand,
        isDisabled: Math.random() < 0.2,
        value: brand.models.map(model => ({
          title: model.name,
          isDisabled: Math.random() < 0.2,
          value: yearsToOptions(model.years)
        }))
      }));
      callback(out);
    });
  }

  /**
   * Парсер названий автомобилей. Устанавливает найденные значения в селекты
   * @param text - строка, в которой ищется соответствие
   */
  private updateOptions(text: string) {
    const words = text.replace(/\s+/g, ' ').toLowerCase().split(' ');

    const selectedBrand = this.form.get('selectedBrand');
    const selectedModel = this.form.get('selectedModel');
    const selectedYear = this.form.get('selectedYear');
    const selectedGen = this.form.get('selectedGen');

    const brand = words.shift();
    if (!brand) { return; }
    const foundBrand = this.brands.find(b => b.title.toLowerCase().indexOf(brand) === 0);
    if (!foundBrand || foundBrand.isDisabled) { return; }
    selectedBrand.setValue(foundBrand);

    const model = words.shift();
    if (!model) { return; }
    const foundModel = selectedBrand.value.value.find(b => b.title.toLowerCase().indexOf(model) === 0);
    if (!foundModel || foundModel.isDisabled) { return; }
    selectedModel.setValue(foundModel);

    const gen = words.shift();
    if (!gen) { return; }
    let foundYears;
    let foundGen;
    for (const year of selectedModel.value.value) {
      for (const generation of year.value) {
        if (generation.title.toLowerCase().indexOf(gen) !== -1) {
          foundYears = year;
          foundGen = generation;
          break;
        }
      }
    }
    if (!foundYears || !foundGen || foundYears.isDisabled || foundGen.isDisabled) { return; }
    selectedYear.setValue(foundYears);
    selectedGen.setValue(foundGen);
  }

  /**
   * Превращает выбранные опции в название автомобиля
   * @returns название автомобиля
   */
  private updateAutoName(): string {
    const title = [];
    if (this.form.controls.selectedBrand.value) {
      title.push(this.form.controls.selectedBrand.value.title);
    }
    if (this.form.controls.selectedModel.value) {
      title.push(this.form.controls.selectedModel.value.title);
    }
    if (this.form.controls.selectedGen.value) {
      title.push(this.form.controls.selectedGen.value.title);
    }
    return title.join(' ');
  }
}
