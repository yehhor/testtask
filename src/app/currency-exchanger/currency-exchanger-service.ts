import {Injectable} from '@angular/core';
import {map, Observable, of} from "rxjs";
import {HttpClient} from "@angular/common/http";
import {DateUtil} from "../utils/DateUtil";

const BASE_URL = `https://www.bankofcanada.ca/valet`
const FEATURES = {
  observations: '/observations/'
}
const CODES_PREFIX = 'FX'

@Injectable({
  providedIn: 'root'
})
export class CurrencyExchangerService {

  constructor(
    private http: HttpClient
  ) {
  }

  convert(
    amount: number,
    targetCode: string,
    date: string,
    baseCode = 'CAD',
  ): Observable<{ rate: number, value: number }> {
    return this.getRate(targetCode, baseCode, date).pipe(
      map(rate => ({
        rate,
        value: +(amount * rate).toFixed(4)
      }))
    )
  }

  getCodes(): Observable<string[]> {
    return of(CURRENCY_CODES)
  }

  getDefaultBaseCurrencyCode(): Observable<string> {
    return of(CURRENCY_CODES[0])
  }

  getDefaultTargetCurrencyCode(): Observable<string> {
    return of(CURRENCY_CODES[1])
  }

  private getRate(targetCode: string, baseCode: string, date: Date | string) {
    const dateFormatted = date instanceof Date ? DateUtil.getFormattedDate(date) : date;
    const searchParams = this.getParamsForDate(dateFormatted);
    const operationCode = this.getExchangeOperationCode(baseCode, targetCode);
    return this.http.get<ConvertResponse>(`${BASE_URL}${FEATURES.observations}${operationCode}?${searchParams}`)
      .pipe(
        map(rates => {
          try {
            return rates.observations[0][operationCode].v
          } catch (e) {
            throw new Error('no rates here');
          }
        })
      )
  }

  private getParamsForDate(date: string) {
    const today = DateUtil.getFormattedDate(new Date())
    if (today === date) {
      return new URLSearchParams({
        recent: '1'
      })
    }
    return new URLSearchParams({
      start_date: date,
      end_date: date
    });
  }

  private getExchangeOperationCode(baseCode: string, targetCode: string) {
    return `${CODES_PREFIX}${targetCode}${baseCode}`
  }

}

export const CURRENCY_CODES = [
  "CAD",
  "USD",
  "EUR",
  "JPY",
  "GBP",
  "AUD",
  "CHF",
  "CNY",
  "HKD",
  "MXN",
  "INR"
]


export type ConvertResponse = {
  seriesDetail: {
    [key: string]: {
      label: string,
      description: string
    }
  },
  observations: Array<{ d: string }
    &
    {
      [key: string]: { v: number }
    }>
}
