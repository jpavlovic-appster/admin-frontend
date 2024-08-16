import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'sbNameTranslate'
})
export class SbNameTranslatePipe implements PipeTransform {

  transform(value: string, ...args: any[]): string {

    // args[0] = object of translated string
    // args[1] = requested translation language

    if (args[1] === 'es' && args[0].name_es) {
      return args[0].name_es;
    } else if (args[1] === 'de' && args[0].name_de) {
      return args[0].name_de;
    } else if (args[1] === 'pt' && args[0].name_pt) {
      return args[0].name_pt;
    } else if (args[1] === 'ru' && args[0].name_ru) {
      return args[0].name_ru;
    } else if (args[1] === 'fr' && args[0].name_fr) {
      return args[0].name_fr;
    } else {
      return args[0].name_en;
    }

  }

}
