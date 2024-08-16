import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'contest_user_status', pure: false })

export class ContestUserStatusPipe implements PipeTransform {
  transform(value: number): any {
    switch (value) {
      case 1:
        return 'joined';
      case 2:
        return 'Fee refund';
      case 3:
        return 'Winner';
      default:
        return 'NA';
    }
  }

  // 1 joined, 2 - Fee refund, 3 - Winner
  
}
