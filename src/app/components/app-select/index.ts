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

    get value(): Option[] {
        return this.selected;
    }

    private onChange: (value: Option[]) => void = null;
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
            this.selected = this.getChecked();
        }
        this.writeValue(this.selected);
        if (!this.multiselect) {
            this.open = false;
        }
    }

    private uncheckAll() {
        this.options.forEach(o => o.checked = false);
    }

    private getChecked() {
        return this.options.filter(o => !!o.checked);
    }

    // --------------------------------------
    // ControlValueAccessor methods
    // --------------------------------------

    public writeValue(options: Option[]): void {
        if (options === null || options === undefined) {
            options = [];
        }
        this.uncheckAll();
        options.forEach(o => {
            o.checked = true;
        })
        this.selected = options;
        this.onChange && this.onChange(this.selected);
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
