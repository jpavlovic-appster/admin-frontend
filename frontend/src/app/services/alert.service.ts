import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import Swal from 'sweetalert2';
declare const toastr: any;

@Injectable({ providedIn : 'root'})

export class AlertService {

  constructor(private translate: TranslateService) { }

  // convenience methods
  success(message: string, options?: any) {
    this.translate.get(message, options).subscribe((res: string) => {
      toastr.success(res);
    });
  }

  error(message: string, options?: any) {
    this.translate.get(message, options).subscribe((res: string) => {
      toastr.error(res);
    });
  }

  // info(message: string) {
  //   this.translate.get(message).subscribe((res: string) => {
  //     toastr.info(res);
  //   });
  // }

  // warn(message: string) {
  //   this.translate.get(message).subscribe((res: string) => {
  //     toastr.warning(res);
  //   });
  // }

  async swalConfirm(text: string) {

    const result = await Swal.fire({
      title: this.translate.instant('SENTENCES.CONFIRM_ARE_YOU_SURE'),
      text,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: this.translate.instant('SENTENCES.CONFIRM_YES'),
      cancelButtonText: this.translate.instant('ACTION_BUTTON.CANCEL')
    });

    return result.isConfirmed;

  }

}
