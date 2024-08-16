import { FormControl, FormGroup } from '@angular/forms';

export class CustomValidators {

  static emailRegEx = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  static imgType: Array<String> = ['png', 'jpg', 'jpeg'];
  // static urlRegex = "((http|https)://)(www.)?" + "[a-zA-Z0-9@:%._\\+~#?&//=]{2,256}\\.[a-z]" + "{2,6}\\b([-a-zA-Z0-9@:%._\\+~#?&//=]*)";
  // static urlRegex = "^((http|https)://)(www.)?(?!.* .*)(?:[a-z0-9][a-z0-9-]{0,61}[a-z0-9]\.)+[a-z0-9][a-z0-9-]{0,61}[a-z0-9]$";
  static urlRegex = "^((http|https)://)(www.)?(?!.* .*)(?:[a-z0-9][a-z0-9-]{0,61}[a-z0-9]\.)?[a-z0-9][a-z0-9-]{0,61}[a-z0-9]$";
  static phoneRegex = '^[\\d\\-\\+\\(\\)]+$';
  static passwordRegex = "^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*]).{8,}$";
  // static passwordRegex = /^(?=.[0-9])(?=.[!@#$%^&])[a-zA-Z0-9!@#$%^&]{6,16}$/;
  // static passwordRegex = '(?=.[a-z])(?=.[A-Z])(?=.[0-9])(?=.[^A-Za-z0-9])(?=.{8,})';

  static videoTypes: Array<String> = ['m4v', 'avi', 'mpg', 'mp4'];

  // custom validator to check that two fields match
  static MustMatch(controlName: string, matchingControlName: string) {
    return (formGroup: FormGroup) => {
      const control = formGroup.controls[controlName];
      const matchingControl = formGroup.controls[matchingControlName];

      if (matchingControl.errors && !matchingControl.errors.mustMatch) {
        // return if another validator has already found an error on the matchingControl
        return;
      }

      // set error on matchingControl if validation fails
      if (control.value !== matchingControl.value) {
        matchingControl.setErrors({ mustMatch: true });
      } else {
        matchingControl.setErrors(null);
      }
    }
  }

  static dateLessThan(startDate: string, endDate: string) {
    return (group: FormGroup) => {
      let f = group.controls[startDate];
      let t = group.controls[endDate];
      if (t.errors && !t.errors.lessThan) {
        // return if another validator has already found an error on the matchingControl
        return;
      }
      if (f.value >= t.value) {
          t.setErrors({ lessThan: true });
      }
      else {
        t.setErrors(null);
    }
  }
}

  static requiredFileType(type: any) {
    return function (control: FormControl) {
      const file = control.value;
      if (file) {
        const extension = file.split('.')[1].toLowerCase();
        const t = type.includes(extension);

        if (!t) {
          return {
            requiredFileType: true
          };
        }
        return null;
      }

      return null;
    };
  }

  static validUsername() {
    return (control: FormControl) => {
      // Regex validation - must start with alphabet, does not contain any character except underscore.
      const pattern = new RegExp(/^[a-zA-Z]([_]?[a-zA-Z0-9]+)*$/);
      const res = pattern.test(control.value);
      // control.setErrors();
      return res ? null : { pattern: 'Must start with alphabet, does not contain any character except underscore' };
    };
  }

}
