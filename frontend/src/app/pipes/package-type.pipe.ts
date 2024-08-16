import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'package_type', pure: false })

export class PackageTypePipe implements PipeTransform {

  transform(value: number): string {
    switch (value) {
      case 1:
        return 'MONTHLY';
      case 2:
        return 'YEARLY';
      default:
        return '--';
    }
  }

}
