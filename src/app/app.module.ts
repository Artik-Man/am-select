import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppComponent } from './app.component';
import { } from '@angular/material';
import { AppSelectComponent } from './components/app-select';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ApiService } from './services/api';
@NgModule({
  declarations: [
    AppComponent,
    AppSelectComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule
  ],
  providers: [
    ApiService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
