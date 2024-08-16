

export class Constants {

  static get THEME_MODES() {
    return [
      {
        palette: {
          mode: "LIGHT",
          primary: {
              main: '#105AFB',
              light_50: '#1887ff',
              light_80: '#1da2ff',
              light_90: '#1eabff',
              dark_20: '#0d48c9',
          },
          secondry: {
            main: '#FC6065',
            light_50: '#ff9098',
            light_80: '#ffadb6',
            light_90: '#ffb6c0',
            dark_20: '#ca4d51',
          }
        },
      },
      {
        palette: {
          mode: "DARK",
          primary: {
              main: '#6857DF',
              light_50: '#9c83ff',
              light_80: '#bb9dff',
              light_90: '#c6a5ff',
              dark_20: '#5346b2',
          },
          secondry: {
            main: '#FC7E46',
            light_50: '#ffbd69',
            light_80: '#ffe37e',
            light_90: '#ffef85',
            dark_20: '#ca6538',
          }
        },
      },
    ];
  }

  // static get COLOR_SHADES() {
  //   return [
  //     {
  //       mode: "LIGHT",
  //       original: '#E65964',
  //       light: {
  //         light_0: '#e65964',
  //         light_10: '#fd626e',
  //         light_20: '#ff6b78',
  //         light_30: '#ff7482',
  //         light_40: '#ff7d8c',
  //         light_50: '#ff8696',
  //         light_60: '#ff8ea0',
  //         light_70: '#ff97aa',
  //         light_80: '#ffa0b4',
  //         light_90: '#ffa9be',
  //         light_100: '#ffb2c8',
  //       },
  //       dark: {
  //         dark_0: '#e65964',
  //         dark_10: '#cf505a',
  //         dark_20: '#b84750',
  //         dark_30: '#a13e46',
  //         dark_40: '#8a353c',
  //         dark_50: '#732d32',
  //         dark_60: '#5c2428',
  //         dark_70: '#451b1e',
  //         dark_80: '#2e1214',
  //         dark_90: '#17090a',
  //         dark_100: '#000000',
  //       }
  //     }
  //   ];
  // }

  static get INIT_THEME() {
    return { "name": "FG Original", "palette": { "type": "dark", "primary": { "main": "#1b53c1", "contrast_text": "#ffffff" }, "secondry": { "main": "#d24538", "contrast_text": "#ffffff" }, "background": { "default": "#282837", "paper": "#282837", "sub_navbar": "#1b53c1" }, "text": { "primary": "#ffffff", "secondry": "#d24538", "disabled": "#666666", "sub_navbar": "#ffffff" }, "action": { "selected": "#d24538" } }, "typography": { "font_family": "'Roboto', 'Helvetica', 'Arial', sans-serif" } }
  };

  static get DARK_THEME() {
    return { "name": "Dark Theme", "palette": { "mode": "DARK", "primary": '#242F39', "secondry": '#DD5555', }, "typography": { "font_family": "'Roboto', 'Helvetica', 'Arial', sans-serif" } }
  };

  static get LIGHT_THEME() {
    return { "name": "Dark Theme", "palette": { "mode": "LIGHT", "primary": '#DD5555', "secondry": '#F8F8F8', }, "typography": { "font_family": "'Roboto', 'Helvetica', 'Arial', sans-serif" } }
  };

  static get CKCONFIG() {
    return {
      toolbar: [
        'heading', '|',
        'alignment', '|',
        'bold', 'italic', 'strikethrough', 'underline', 'subscript', 'superscript', '|',
        'link', '|',
        'bulletedList', 'numberedList',
        'insertTable', '|',
        'uploadImage', 'undo', 'redo'
      ],
      image: {
        toolbar: [
          'linkImage',
          'toggleImageCaption',
          'imageTextAlternative',
          'imageStyle:full',
          'imageStyle:inline',
          'imageStyle:block',
          'imageStyle:side',
        ]
      }
    }
  };

  static get BONUS_TYPES() {
    return [
      { value: 1, name: 'FLAT' },
      { value: 2, name: 'PERCENTAGE' }
    ];
  }


  // static get ROWS() {
  //   return [
  //     { id: 1, name: 'Row 1' },
  //     { id: 2, name: 'Row 2' },
  //     { id: 3, name: 'Row 3' }
  //   ]
  // }

  // static get REELS() {
  //   return [
  //     { id: 1, name: 'Reel 1' },
  //     { id: 2, name: 'Reel 2' },
  //     { id: 3, name: 'Reel 3' },
  //     { id: 4, name: 'Reel 4' },
  //     { id: 5, name: 'Reel 5' }
  //   ];
  // }

  static get SYMBOL_TYPES() {
    return [
      { id: 1, name: 'Symbol' },
      { id: 2, name: 'Wild' },
      { id: 3, name: 'Bonus' }
    ];
  }

  static get VALID_URL_CREDENTIAL() {
    return ['OPERATOR_DEBIT_API', 'OPERATOR_CREDIT_API', 'OPERATOR_SUCCESS_API', 'OPERATOR_PROFILE_API'];
  }

  static get supportedLangs() {
    return { 'de': 'German', 'en': 'English', 'es': 'Spanish', 'fr': 'French', 'pt': 'Portuguese', 'ru': 'Russian', 'tr': 'Turkish' };
  }

  static defaultLang: any = localStorage.getItem('lang') || 'en';

  static permissionHeaders = {

    "tenants": "TENANTS",
    "themes": "THEMES",
    "currencies": "CURRENCIES",
    "admins": "ADMINS",
    "affiliates": "AFFILIATES",
    "crm": "CRM",
    "cms": "CMS",
    "tenant_credentials": "TENANT_CREDENTIALS",
    "subscriber_credentials": "SUBSCRIBER_CREDENTIALS",
    "tenant_configurations": "TENANT_CONFIGURATIONS",
    "subscriber_configurations": "SUBSCRIBER_CONFIGURATIONS",
    "tenant_settings": "TENANT_SETTINGS",
    "tenant_theme_settings": "TENANT_THEME_SETTINGS",
    "subscriber_theme_settings": "SUBSCRIBER_THEME_SETTINGS",
    "subscriber_settings": "SUBSCRIBER_SETTINGS",
    "tenant_packages": "TENANT_PACKAGES",
    "subscriber_packages": "SUBSCRIBER_PACKAGES",
    "users": "USERS",
    "transactions": "TRANSACTIONS",
    "sport_transactions": "SPORT_TRANSACTIONS",
    "advertisements": "ADVERTISEMENTS",
    "bonus": "BONUS",
    "bet_history": "BET_HISTORY",
    "fantasy_contests": "FANTASY_CONTESTS",
    "fantasy_matches": "FANTASY_MATCHES",
    "fantasy_players": "FANTASY_PLAYERS",
    "fantasy_teams": "FANTASY_TEAMS",
    "sports_betting_sports": "SPORTS_BETTING_SPORTS",
    "sports_betting_countries": "SPORTS_BETTING_COUNTRIES",
    "sports_betting_tournaments": "SPORTS_BETTING_TOURNAMENTS",
    "sports_betting_matches": "SPORTS_BETTING_MATCHES",
    "sports_betting_markets": "SPORTS_BETTING_MARKETS",
    "subscribers": "SUBSCRIBERS",
    "slot_games": "SLOT_GAMES"
  }

}

export const dateFormat: string = "YYYY-MM-DD HH:mm";

export const ThemeFonts = [
  { value: "'Roboto', 'Helvetica', 'Arial', sans-serif", name: "'Roboto', 'Helvetica', 'Arial', sans-serif" },
  { value: "Droid Sans", name: "Droid Sans" },
  { value: "Droid Serif", name: "Droid Serif" },
  { value: "Lato", name: "Lato" },
  { value: "Lora", name: "Lora" },
  { value: "Montserrat", name: "Montserrat" },
  { value: "Open Sans", name: "Open Sans" },
  { value: "Oswald", name: "Oswald" },
  { value: "PT Sans", name: "PT Sans" },
  { value: "Raleway", name: "Raleway" },
  { value: "Roboto", name: "Roboto" },
  { value: "Slabo 27px", name: "Slabo 27px" },
  { value: "Source Sans Pro", name: "Source Sans Pro" }
];

export const PageSizes = [
  { name: 10 },
  { name: 25 },
  { name: 50 },
  { name: 100 },
  { name: 200 },
  { name: 500 },
];


export const Roles = [
  { name: 'Owner', value: 1 },
  { name: 'Agent', value: 2 }
];


export const adminAgentRoles = [
  { name: 'Agent', value: 2 }
];


export const SuperAdminAssigningRoles = [
  { name: 'Owner', value: 1 }
];

export const TransactionTypes = [
  { name: 'BET', title: 'bet', value: 0 },
  { name: 'WIN', title: 'win', value: 1 },
  { name: 'REFUND', title: 'refund', value: 2 },
  { name: 'DEPOSIT', title: 'deposit', value: 3 },
  { name: 'WITHDRAW', title: 'withdraw', value: 4 },
  { name: 'NON_CASH_GRANTED_BY_ADMIN', title: 'non_cash_granted_by_admin', value: 5 },
  { name: 'NON_CASH_WITHDRAW_BY_ADMIN', title: 'non_cash_withdraw_by_admin', value: 6 },
  { name: 'TIP', title: 'non_cash_grtipanted_by_admin', value: 7 },
  { name: 'BET_NON_CASH', title: 'bet_non_cash', value: 8 },
  { name: 'WIN_NON_CASH', title: 'win_non_cash', value: 9 },
  { name: 'REFUND_NON_CASH', title: 'refund_non_cash', value: 10 },
  { name: 'NON_CASH_BONUS_CLAIM', title: 'non_cash_bonus_claim', value: 11 },
  { name: 'DEPOSIT_BONUS_CLAIM', title: 'deposit_bonus_claim', value: 12 },
  { name: 'TIP_NON_CASH', title: 'tip_non_cash', value: 13 },
  { name: 'WITHDRAW_CANCEL', title: 'withdraw_cancel', value: 14 }
]


export const TIMEZONE = [
  { value: 'American Samoa', name: '(GMT-11:00) American Samoa' },
  { value: 'Midway Island', name: '((GMT-11:00) Midway Island' },
  { value: 'International Date Line West', name: '(GMT-12:00) International Date Line West' },
  { value: 'Hawaii', name: '(GMT-10:00) Hawaii' },
  { value: 'Alaska', name: '(GMT-09:00) Alaska' },
  { value: 'Pacific Time (US & Canada)', name: '(GMT-08:00) Pacific Time (US & Canada)' },
  { value: 'Tijuana', name: '(GMT-08:00) Tijuana' },
  { value: 'Arizona', name: '(GMT-07:00) Arizona' },
  { value: 'Chihuahua', name: '(GMT-07:00) Chihuahua' },
  { value: 'Mazatlan', name: '(GMT-07:00) Mazatlan' },
  { value: 'Mountain Time (US & Canada)', name: '(GMT-07:00) Mountain Time (US & Canada)' },
  { value: 'Central America', name: '(GMT-06:00) Central America' },
  { value: 'Central Time (US & Canada)', name: '(GMT-06:00) Central Time (US & Canada)' },
  { value: 'Guadalajara', name: '(GMT-06:00) Guadalajara' },
  { value: 'Mexico City', name: '(GMT-06:00) Mexico City' },
  { value: 'Monterrey', name: '(GMT-06:00) Monterrey' },
  { value: 'Saskatchewan', name: '(GMT-06:00) Saskatchewan' },
  { value: 'Bogota', name: '(GMT-05:00) Bogota' },
  { value: 'Eastern Time (US & Canada)', name: '(GMT-05:00) Eastern Time (US & Canada)' },
  { value: 'Indiana (East)', name: '(GMT-05:00) Indiana (East)' },
  { value: 'Lima', name: '(GMT-05:00) Lima' },
  { value: 'Quito', name: '(GMT-05:00) Quito' },
  { value: 'Atlantic Time (Canada)', name: '(GMT-04:00) Atlantic Time (Canada)' },
  { value: 'Caracas', name: '(GMT-04:00) Caracas' },
  { value: 'Georgetown', name: '(GMT-04:00) Georgetown' },
  { value: 'La Paz', name: '(GMT-04:00) La Paz' },
  { value: 'Puerto Rico', name: '(GMT-04:00) Puerto Rico' },
  { value: 'Santiago', name: '(GMT-04:00) Santiago' },
  { value: 'Newfoundland', name: '(GMT-03:30) Newfoundland' },
  { value: 'Brasilia', name: '(GMT-03:00) Brasilia' },
  { value: 'Buenos Aires', name: '(GMT-03:00) Buenos Aires' },
  { value: 'Greenland', name: '(GMT-03:00) Greenland' },
  { value: 'Montevideo', name: '(GMT-03:00) Montevideo' },
  { value: 'Mid-Atlantic', name: '(GMT-02:00) Mid-Atlantic' },
  { value: 'Azores', name: '(GMT-01:00) Azores' },
  { value: 'Cape Verde Is.', name: '(GMT-01:00) Cape Verde Is.' },
  { value: 'Edinburgh', name: '(GMT+00:00) Edinburgh' },
  { value: 'Lisbon', name: '(GMT+00:00) Lisbon' },
  { value: 'London', name: '(GMT+00:00) London' },
  { value: 'Monrovia', name: '(GMT+00:00) Monrovia' },
  { value: 'Amsterdam', name: '(GMT+01:00) Amsterdam' },
  { value: 'Belgrade', name: '(GMT+01:00) Belgrade' },
  { value: 'Berlin', name: '(GMT+01:00) Berlin' },
  { value: 'Bern', name: '(GMT+01:00) Bern' },
  { value: 'Bratislava', name: '(GMT+01:00) Bratislava' },
  { value: 'Brussels', name: '(GMT+01:00) Brussels' },
  { value: 'Budapest', name: '(GMT+01:00) Budapest' },
  { value: 'Casablanca', name: '(GMT+01:00) Casablanca' },
  { value: 'Copenhagen', name: '(GMT+01:00) Copenhagen' },
  { value: 'Dublin', name: '(GMT+01:00) Dublin' },
  { value: 'Ljubljana', name: '(GMT+01:00) Ljubljana' },
  { value: 'Madrid', name: '(GMT+01:00) Madrid' },
  { value: 'Paris', name: '(GMT+01:00) Paris' },
  { value: 'Prague', name: '(GMT+01:00) Prague' },
  { value: 'Rome', name: '(GMT+01:00) Rome' },
  { value: 'Sarajevo', name: '(GMT+01:00) Sarajevo' },
  { value: 'Skopje', name: '(GMT+01:00) Skopje' },
  { value: 'Stockholm', name: '(GMT+01:00) Stockholm' },
  { value: 'Vienna', name: '(GMT+01:00) Vienna' },
  { value: 'Warsaw', name: '(GMT+01:00) Warsaw' },
  { value: 'West Central Africa', name: '(GMT+01:00) West Central Africa' },
  { value: 'Zagreb', name: '(GMT+01:00) Zagreb' },
  { value: 'Zurich', name: '(GMT+01:00) Zurich' },
  { value: 'Athens', name: '(GMT+02:00) Athens' },
  { value: 'Bucharest', name: '(GMT+02:00) Bucharest' },
  { value: 'Cairo', name: '(GMT+02:00) Cairo' },
  { value: 'Harare', name: '(GMT+02:00) Harare' },
  { value: 'Helsinki', name: '(GMT+02:00) Helsinki' },
  { value: 'Jerusalem', name: '(GMT+02:00) Jerusalem' },
  { value: 'Kaliningrad', name: '(GMT+02:00) Kaliningrad' },
  { value: 'Kyiv', name: '(GMT+02:00) Kyiv' },
  { value: 'Pretoria', name: '(GMT+02:00) Pretoria' },
  { value: 'Riga', name: '(GMT+02:00) Riga' },
  { value: 'Sofia', name: '(GMT+02:00) Sofia' },
  { value: 'Tallinn', name: '(GMT+02:00) Tallinn' },
  { value: 'Vilnius', name: '(GMT+02:00) Vilnius' },
  { value: 'Baghdad', name: '(GMT+03:00) Baghdad' },
  { value: 'Istanbul', name: '(GMT+03:00) Istanbul' },
  { value: 'Kuwait', name: '(GMT+03:00) Kuwait' },
  { value: 'Minsk', name: '(GMT+03:00) Minsk' },
  { value: 'Moscow', name: '(GMT+03:00) Moscow' },
  { value: 'Nairobi', name: '(GMT+03:00) Nairobi' },
  { value: 'Riyadh', name: '(GMT+03:00) Riyadh' },
  { value: 'St. Petersburg', name: '(GMT+03:00) St. Petersburg' },
  { value: 'Volgograd', name: '(GMT+03:00) Volgograd' },
  { value: 'Tehran', name: '(GMT+03:30) Tehran' },
  { value: 'Abu Dhabi', name: '(GMT+04:00) Abu Dhabi' },
  { value: 'Baku', name: '(GMT+04:00) Baku' },
  { value: 'Muscat', name: '(GMT+04:00) Muscat' },
  { value: 'Samara', name: '(GMT+04:00) Samara' },
  { value: 'Tbilisi', name: '(GMT+04:00) Tbilisi' },
  { value: 'Yerevan', name: '(GMT+04:00) Yerevan' },
  { value: 'Kabul', name: '(GMT+04:30) Kabul' },
  { value: 'Ekaterinburg', name: '(GMT+05:00) Ekaterinburg' },
  { value: 'Islamabad', name: '(GMT+05:00) Islamabad' },
  { value: 'Karachi', name: '(GMT+05:00) Karachi' },
  { value: 'Tashkent', name: '(GMT+05:00) Tashkent' },
  { value: 'Chennai', name: '(GMT+05:30) Chennai' },
  { value: 'Kolkata', name: '(GMT+05:30) Kolkata' },
  { value: 'Mumbai', name: '(GMT+05:30) Mumbai' },
  { value: 'New Delhi', name: '(GMT+05:30) New Delhi' },
  { value: 'Sri Jayawardenepura', name: '(GMT+05:30) Sri Jayawardenepura' },
  { value: 'Kathmandu', name: '(GMT+05:45) Kathmandu' },
  { value: 'Almaty', name: '(GMT+06:00) Almaty' },
  { value: 'Astana', name: '(GMT+06:00) Astana' },
  { value: 'Dhaka', name: '(GMT+06:00) Dhaka' },
  { value: 'Urumqi', name: '(GMT+06:00) Urumqi' },
  { value: 'Rangoon', name: '(GMT+06:30) Rangoon' },
  { value: 'Bangkok', name: '(GMT+07:00) Bangkok' },
  { value: 'Hanoi', name: '(GMT+07:00) Hanoi' },
  { value: 'Jakarta', name: '(GMT+07:00) Jakarta' },
  { value: 'Krasnoyarsk', name: '(GMT+07:00) Krasnoyarsk' },
  { value: 'Novosibirsk', name: '(GMT+07:00) Novosibirsk' },
  { value: 'Beijing', name: '(GMT+08:00) Beijing' },
  { value: 'Chongqing', name: '(GMT+08:00) Chongqing' },
  { value: 'Hong Kong', name: '(GMT+08:00) Hong Kong' },
  { value: 'Irkutsk', name: '(GMT+08:00) Irkutsk' },
  { value: 'Kuala Lumpur', name: '(GMT+08:00) Kuala Lumpur' },
  { value: 'Perth', name: '(GMT+08:00) Perth' },
  { value: 'Singapore', name: '(GMT+08:00) Singapore' },
  { value: 'Taipei', name: '(GMT+08:00) Taipei' },
  { value: 'Ulaanbaatar', name: '(GMT+08:00) Ulaanbaatar' },
  { value: 'Osaka', name: '(GMT+09:00) Osaka' },
  { value: 'Sapporo', name: '(GMT+09:00) Sapporo' },
  { value: 'Seoul', name: '(GMT+09:00) Seoul' },
  { value: 'Tokyo', name: '(GMT+09:00) Tokyo' },
  { value: 'Yakutsk', name: '(GMT+09:00) Yakutsk' },
  { value: 'Adelaide', name: '(GMT+09:30) Adelaide' },
  { value: 'Darwin', name: '(GMT+09:30) Darwin' },
  { value: 'Brisbane', name: '(GMT+10:00) Brisbane' },
  { value: 'Canberra', name: '(GMT+10:00) Canberra' },
  { value: 'Guam', name: '(GMT+10:00) Guam' },
  { value: 'Hobart', name: '(GMT+10:00) Hobart' },
  { value: 'Melbourne', name: '(GMT+10:00) Melbourne' },
  { value: 'Port Moresby', name: '(GMT+10:00) Port Moresby' },
  { value: 'Sydney', name: '(GMT+10:00) Sydney' },
  { value: 'Vladivostok', name: '(GMT+10:00) Vladivostok' },
  { value: 'Magadan', name: '(GMT+11:00) Magadan' },
  { value: 'New Caledonia', name: '(GMT+11:00) New Caledonia' },
  { value: 'Solomon Is.', name: '(GMT+11:00) Solomon Is.' },
  { value: 'Srednekolymsk', name: '(GMT+11:00) Srednekolymsk' },
  { value: 'Auckland', name: '(GMT+12:00) Auckland' },
  { value: 'Fiji', name: '(GMT+12:00) Fiji' },
  { value: 'Kamchatka', name: '(GMT+12:00) Kamchatka' },
  { value: 'Marshall Is.', name: '(GMT+12:00) Marshall Is.' },
  { value: 'Wellington', name: '(GMT+12:00) Wellington' },
  { value: 'Chatham Is.', name: '(GMT+12:45) Chatham Is.' },
  { value: "Nuku'alofa", name: "(GMT+13:00) Nuku'alofa" },
  { value: 'Samoa', name: '(GMT+13:00) Samoa' },
  { value: 'Tokelau Is.', name: '(GMT+13:00) Tokelau Is.' },
];

