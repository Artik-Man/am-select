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
            const checked = (event.target as HTMLInputElement).checked;
            if (checked && this.multiselect) {
                this.selected.push(option);
            } else if (checked) {
                this.selected = [option];
            } else if (this.multiselect) {
                this.selected = remove(this.selected, option);
            } else {
                this.selected = [];
            }
        }
        this.writeValue(this.selected);
        if (!this.multiselect) {
            this.open = false;
        }
    }

    // --------------------------------------
    // ControlValueAccessor methods
    // --------------------------------------

    public writeValue(options: Option[]): void {
        if (options === null || options === undefined) {
            return;
        }
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
}
