import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {HttpClientModule} from "@angular/common/http";
import {CurrencyExchangerComponent} from "./currency-exchanger.component";

@NgModule({
  declarations: [
    CurrencyExchangerComponent,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule,
    ReactiveFormsModule,
  ],
  providers: [],
  exports: [
    CurrencyExchangerComponent
  ]
})
export class CurrencyExchangerModule {
}
