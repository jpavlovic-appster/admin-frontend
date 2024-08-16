import { Pipe, PipeTransform } from '@angular/core';
import * as _ from 'lodash';

@Pipe({
  name: 'sentancecase'
})
export class SentancecasePipe implements PipeTransform {

  transform(value: string, ...args: unknown[]): unknown {
    return _.startCase(value);
  }

}
