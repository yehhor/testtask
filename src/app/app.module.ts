import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {AppComponent} from './app.component';
import {CurrencyExchangerModule} from "./currency-exchanger/currency-exchanger.module";

@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    CurrencyExchangerModule,
    BrowserModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {
}
