import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'language', pure: false })

export class LanguagePipe implements PipeTransform {
  transform(lang: string): string {

    switch (lang) {
      case 'en':
        return 'English';
      case 'de':
        return 'German';
      case 'es':
        return 'Spanish';
      case 'fr':
        return 'French';
      case 'pt':
        return 'Portuguese';
      case 'ru':
        return 'Russian';
      default:
        return 'English';
    }

  }
}
