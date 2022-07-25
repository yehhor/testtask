import {Injectable} from '@angular/core';
import {Subject} from "rxjs";

@Injectable()
export class AutoDestroyService extends Subject<null> {
  ngOnDestroy() {
    this.next(null);
    this.complete();
  }

}
