import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'truncate_string', pure: false })

export class TruncateStringPipe implements PipeTransform {
  transform(txt: string, len: number): any {
 
    if(txt && len) {
      return txt.length > len ? txt.substring(0, len)+'...' : txt;
    } else {
      return txt;
    }

  }
}
