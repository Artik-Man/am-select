import { Injectable } from '@angular/core';

@Injectable()
export class ApiService {
    private models = {
        '2015 - 2016': [
            'Gen I',
            'Gen II',
            'Gen III',
            'Gen IV',
        ],
        '2016 - 2017': [
            'Gen I',
            'Gen II',
            'Gen III'
        ],
        '2017 - 2018': [
            'Gen I',
            'Gen II'
        ],
        '2018 - 2019': [
            'Gen I'
        ],
    };

    private base = {
        'Audi': ['A1', 'A2', 'A3', 'A4'],
        'BMW': ['M3', 'M4', 'M5', 'M6', 'i3', 'i8', 'X1', 'X2', 'X3', 'X4', 'X5', 'X6', 'X7'],
        'Chevrolet': ['Astro', 'Avalanche', 'Aveo', 'Blazer', 'Camaro', 'Captiva', 'Cavalier', 'Cobalt', 'Corvette', 'Cruze'],
        'Ford': ['Econoline', 'EcoSport', 'Edge', 'Escape', 'Escort', 'Excursion', 'Expedition', 'Explorer'],
        'Hyundai': ['Accent', 'Avante', 'Coupe', 'Creta', 'Elantra', 'Equus', 'Galloper', 'Genesis'],
        'Kia': ['GT', 'Cerato', 'Clarus', 'Forte', 'Joice'],
        'Lexus': ['CT', 'ES', 'GS', 'GS F', 'GX', 'HS', 'IS', 'IS F', 'LC', 'LS', 'LX', 'NX', 'RC', 'RC F', 'RX', 'SC', 'UX'],
        'Mazda': ['Atenza', 'Axela', 'B-series', 'Biante', 'Bongo', 'Bongo Friendee', 'BT-50'],
        'Mercedes-Benz': ['A-klasse', 'B-klasse', 'C-klasse', 'CL-klasse', 'CLA-klasse', 'CLK-klasse', 'CLS-klasse', 'E-klasse'],
        'Nissan': ['Almera', 'Almera Classic', 'Bluebird', 'Cefiro', 'Cube', 'Juke', 'Laurel', 'Leaf'],
        'Toyota': ['Auris', 'Avensis', 'C-HR', 'Caldina', 'Camry', 'Carina', 'Celica', 'Chaser', 'Corolla'],
        'Volkswagen': ['Amarok', 'Beetle', 'Bora', 'Caddy', 'California', 'Caravelle', 'Eos', 'Fox', 'Golf']
    };

    constructor() {

    }

    public getBrands(): Promise<Brand[]> {
        const brands: Brand[] = [];
        Object.keys(this.base).forEach(brand => {
            brands.push({
                brand: brand,
                models: this.base[brand].map(model => ({
                    name: model,
                    years: this.models
                }))
            });
        });
        return new Promise(resolve => {
            resolve(brands);
        });
    }

}

interface Brand {
    brand: string;
    models: {
        name: string;
        years: {
            [years: string]: string[]
        }
    }[];
}
