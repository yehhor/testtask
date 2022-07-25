import {ChangeDetectionStrategy, ChangeDetectorRef, Component} from '@angular/core';
import {CurrencyExchangerService} from "./currency-exchanger-service";
import {AutoDestroyService} from "../auto-destroy.service";
import {catchError, debounceTime, distinctUntilChanged, EMPTY, filter, map, takeUntil, zip} from "rxjs";
import {DateUtil} from '../utils/DateUtil';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";

@Component({
  selector: 'app-currency-exchanger',
  templateUrl: './currency-exchanger.component.html',
  styleUrls: ['./currency-exchanger.component.css'],
  providers: [AutoDestroyService],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CurrencyExchangerComponent {
  availableCodes$ = this.currencyService.getCodes();
  MAX_DATE = DateUtil.getFormattedDate(new Date())
  convertedAmount: number = 0;
  rate: number | null = null;
  dateOfConversion: string = '';
  form!: FormGroup;
  readonly DEFAULT_CODE = 'CAD';
  get baseCurrency() {
    return this.form.getRawValue().baseCurrency
  }
  get targetCurrency() {
    return this.form.getRawValue().targetCurrency
  }

  constructor(
    private currencyService: CurrencyExchangerService,
    private destroy$: AutoDestroyService,
    private fb: FormBuilder,
    private cdr: ChangeDetectorRef
  ) {
    this.buildForm();
    this.assignCurrencyCodes();
  }

  convert() {
    const {amount, targetCurrency, selectedDate, baseCurrency} = this.form.getRawValue();
    this.currencyService.convert(amount, targetCurrency, selectedDate, baseCurrency)
      .pipe(
        takeUntil(this.destroy$),
        catchError(error => {
          alert(error)
          return EMPTY;
        })
      )
      .subscribe(({rate, value}) => {
        this.convertedAmount = value;
        this.rate = rate;
        this.dateOfConversion = this.form.getRawValue().selectedDate;
        this.cdr.detectChanges();
      })
  }

  private buildForm() {
    this.form = this.fb.group({
      baseCurrency: ['', Validators.required],
      targetCurrency: ['', Validators.required],
      amount: [0, [Validators.required, Validators.min(0)]],
      selectedDate: [DateUtil.getFormattedDate(new Date()), Validators.required]
    })
    const currencyChanges = this.form.valueChanges.pipe(
      takeUntil(this.destroy$),
      debounceTime(500),
    )
    currencyChanges.pipe(
      map(({baseCurrency}) => baseCurrency),
      distinctUntilChanged(),
      filter(i => i !== this.DEFAULT_CODE)
    )
      .subscribe(changed => this.form.patchValue({targetCurrency: this.DEFAULT_CODE}, {emitEvent: false}))

    currencyChanges.pipe(
      map(({targetCurrency}) => targetCurrency),
      distinctUntilChanged(),
      filter(i => i !== this.DEFAULT_CODE)
    )
      .subscribe(changed => this.form.patchValue({baseCurrency: this.DEFAULT_CODE}, {emitEvent: false}))
  }

  private assignCurrencyCodes() {
    zip(this.currencyService.getDefaultBaseCurrencyCode(), this.currencyService.getDefaultTargetCurrencyCode())
      .pipe(
        takeUntil(this.destroy$)
      )
      .subscribe(([baseCurrency, targetCurrency]) => {
        this.form.patchValue({
          baseCurrency,
          targetCurrency
        })
      })
  }
}


