import { Component, ElementRef, OnInit , ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { Currency } from 'src/app/models';
import { TenantService } from 'src/app/modules/tenant/tenant.service';
import { AlertService } from 'src/app/services/alert.service';
import { CurrenciesService } from '../../currencies/currencies.service';

@Component({
  selector: 'app-sound',
  templateUrl: './sound.component.html',
  styleUrls: ['./sound.component.scss']
})
export class SoundComponent implements OnInit {

  @ViewChild('file') logo_file!: ElementRef ;
  sound:any;
  id: number = 0;
  dId: number =0;
  start_sound_file: File | null = null;
  bg_sound_file: File | null = null;
  flew_away_sound_file: File | null = null;
  language:any;
  currency!: Currency;
  imgURL: any;
  configForm: FormGroup | any;
  submitted: boolean = false;
  currencyLoader: boolean = false;
  primary: any = {};

  translations = {
    "HOME": "",
    "LANGUAGES": "",
    "SOUND": ""
  };

  breadcrumbs: Array<any> = [];

  title = 'ACTION_BUTTON.CREATE';

  // Permission Variables
  requestReadPermissions = btoa(btoa('currencies|:|R'));
  componentCreatePermissions = btoa(btoa('currencies|:|C'));
  requestUpdatePermissions = btoa(btoa('currencies|:|U'));
  canCreate = false;
  canEdit = false;

  constructor(private route: ActivatedRoute,
    private AlertService: AlertService,
    private router: Router,
    private formBuilder: FormBuilder,
    private currenciesService: CurrenciesService,
    private tenantService: TenantService,
    private translateService: TranslateService) {
    this.id = this.route.snapshot.params['id'];
    this.dId = this.route.snapshot.params['dId'];

    this.configForm = this.formBuilder.group({

      bg_sound: ['', [Validators.required]],
      start_sound: ['', [Validators.required]],
      flew_away_sound: ['', [Validators.required]],

    });

    if (this.id > 0) {
      this.title = 'ACTION_BUTTON.EDIT';

    }

    this.getSounds();

    // this.breadcrumbs.push({ title, path: `/super-admin/currencies/${this.id}` });

  }

  ngOnInit(): void {
    this.setPermissions();
    this.doTranslation();
    this.translateService.onLangChange.subscribe(event => {
      this.doTranslation();
    });
  }

  setPermissions() {
    let loggedInUserPermissions: any = localStorage.getItem('permissions');
    loggedInUserPermissions = JSON.parse(atob(atob(loggedInUserPermissions)));

    this.canCreate = loggedInUserPermissions.currencies.includes('C');
    this.canEdit = loggedInUserPermissions.currencies.includes('U');
  }


  selectFile(files: any) {
    if (files.length === 0)
      return;
    const extension = files[0].name.split('.')[1].toLowerCase();

    if (extension != 'mp3') {
      this.AlertService.error('mp3 file needed');
      this.configForm.controls['bg_sound'].reset()

        return;
    }

      const reader = new FileReader();
      reader.readAsDataURL(files[0]);

      reader.onload = (_event) => {
        this.imgURL = reader.result;
      }
      this.bg_sound_file = files[0];
      
  }
  selectFile1(files: any) {
    if (files.length === 0)
      return;
    const extension = files[0].name.split('.')[1].toLowerCase();

    if (extension != 'mp3') {
      this.AlertService.error('mp3 file needed');
      this.configForm.controls['start_sound'].reset()

        return;
    }

      const reader = new FileReader();
      reader.readAsDataURL(files[0]);

      reader.onload = (_event) => {
        this.imgURL = reader.result;
      }
      this.start_sound_file = files[0];
      
  }
  selectFile2(files: any) {
    if (files.length === 0)
      return;
    const extension = files[0].name.split('.')[1].toLowerCase();

    if (extension != 'mp3') {
      this.AlertService.error('mp3 file needed');
      this.configForm.controls['flew_away_sound'].reset()

        return;
    }

      const reader = new FileReader();
      reader.readAsDataURL(files[0]);

      reader.onload = (_event) => {
        this.imgURL = reader.result;
      }
      this.flew_away_sound_file = files[0];
      
  }

  // selectFile2(files: any) {
  //   if (files.length === 0)
  //     return;
  //   const extension = files[0].name.split('.')[1].toLowerCase();

  //   if (extension != 'mp3') {
  //     console.log('use mp3 fromat');
  //     this.configForm.controls['bg_sound'].reset()
  //       return;
  //   }

  //     const reader = new FileReader();
  //     reader.readAsDataURL(files[0]);

  //     reader.onload = (_event) => {
  //       this.imgURL = reader.result;
  //     }

  //     this.bg_sound_file = files[0];



  // }

  get f() {
    return this.configForm.controls;
  }


//   download() {

//     this.tenantService
//       .download('/public/i18n/en.json')
//       .subscribe(blob => saveAs(blob, 'en.json'))
// }

  onSubmit() {

    this.submitted = true;
    // stop here if form is invalid



    if (this.configForm.invalid) return;

    this.currencyLoader = true;

    const fd = new FormData();

    if (this.start_sound_file && this.start_sound_file.name) {
      fd.append('start_sound', this.start_sound_file, this.start_sound_file.name);
    }

    if (this.bg_sound_file && this.bg_sound_file.name) {
      fd.append('bg_sound', this.bg_sound_file, this.bg_sound_file.name);
    }

    if (this.flew_away_sound_file && this.flew_away_sound_file.name) {
      fd.append('flew_away_sound', this.flew_away_sound_file, this.flew_away_sound_file.name);
    }


      this.tenantService.updateSound(fd,this.id)
        .subscribe((response: any) => {
          if (response?.message) {
            this.AlertService.success(response.message);
          }
          this.router.navigate(['/super-admin/subscribers/list/0']);
        }, (err: any) => {
          this.currencyLoader = false;

        });
  }

  getSounds(){
    this.tenantService.getSound(this.id)
    .subscribe((response: any) => {
      
      this.sound = response.record;
      console.log(this.sound);

      }
    )
  }
  

  doTranslation() {
    this.translations[this.title] = "";
    this.translateService.get(Object.keys(this.translations)).subscribe((res) => {
      this.translations = res;
      this.breadcrumbs = [
        // { title: this.translations['HOME'], path: '/super-admin/subscribers' },
        { title: this.translations['SOUND'], path: '/super-admin/subscribers/list/0' },
        { title: this.translations[this.title], path: '' },
      ];
    });
  }

}

