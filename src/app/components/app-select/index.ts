import { Component, Input, forwardRef } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { remove } from 'lodash';

@Component({
    selector: 'app-select',
    templateUrl: 'template.html',
    styleUrls: ['styles.less'],
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => AppSelectComponent),
            multi: true
        }
    ]
})

export class AppSelectComponent implements ControlValueAccessor {
    @Input() options: Option[] = [];
    @Input() multiselect = false;
    @Input() disabled = false;
    @Input() placeholder = '';

    public selected: Option[] = [];
    public optionsName: string;
    public open = false;

    get value(): Option[] | Option {
        return this.getValue();
    }

    private onChange: (value: Option[] | Option) => void = null;
    private onTouched: () => void = null;

    constructor() {
        console.log(this);
        this.optionsName = Math.random().toString(36).substring(2);
    }

    public openOptions() {
        if (!this.disabled) {
            this.open = true;
        }
    }

    public selectOption(option: Option, event: Event) {
        if (this.disabled) {
            return;
        }
        if (!option) {
            this.selected = [];
        } else {
            if (!this.multiselect) {
                this.uncheckAll();
            }
            option.checked = (event.target as HTMLInputElement).checked;
            this.selected = this.options.filter(o => !!o.checked);
        }
        if (this.multiselect) {
        } else {
            this.open = false;
        }
        this.writeValue(this.selected);
    }

    private uncheckAll() {
        this.options.forEach(o => o.checked = false);
    }

    private getValue(): Option[] | Option {
        if (!this.multiselect) {
            return this.selected[0] || null;
        }
        return this.selected;
    }

    // --------------------------------------
    // ControlValueAccessor methods
    // --------------------------------------

    public writeValue(options: Option[]): void {
        if (!Array.isArray(options)) {
            if (options !== null && options !== undefined) {
                options = [].concat(options);
            } else {
                options = [];
            }
        }
        this.uncheckAll();
        if (Array.isArray(options)) {
            options.forEach(o => {
                o.checked = true;
            });
            this.selected = options;
        } else {
            this.selected = [options];
        }
        const value = this.getValue();
        this.onChange && this.onChange(value);
        this.onTouched && this.onTouched();
    }

    public registerOnChange(fn: any): void {
        this.onChange = fn;
    }

    public registerOnTouched(fn: any): void {
        this.onTouched = fn;
    }

    public setDisabledState(isDisabled: boolean): void {
        this.disabled = isDisabled;
    }
}

export interface Option {
    value: any;
    title: string;
    isDisabled?: boolean;
    checked?: boolean;
}
