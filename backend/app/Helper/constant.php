<?php

use Carbon\Carbon;

define('GENERAL_KEY', 'notrinsaca');

define('FLAT', 1);
define('PERCENTAGE', 2);

// Roles
define('ROLES', [
  'SUPER' => [
    'SUPER_ADMIN' => 'Super Admin',
    'ADMIN' => 'Admin',
    'SUPPORT_STAFF' => 'Support Staff'
  ],
  'TENANT' => [
    'AGENT' => 'Agent',
    'ADMIN' => 'Admin',
    'SUPER_SENIOR' => 'Super Senior',
    'SENIOR_MASTER' => 'Senior Master',
    'MASTER_AGENT' => 'Master Agent'
  ]
]);

define('PRIMARY_CURRENCY', 'EUR');

define('ADMIN_TYPE', 'AdminUser');
define('SUPER_ADMIN_TYPE', 'SuperAdminUser');
define('USER_TYPE', 'User');

define('AGENT', "agent");

define('ADMIN_ROLE_ID', 1);
define('AJENT_ROLE_ID', 2);
define('COMMISSION_PERCENTAGE', 'commission_percentage');

define('SELF_PARENT_ID', 1);


define('TRANSACTION_TYPE_WITHDRAWAL', 4);

define('TRANSACTION_TYPE_DEPOSIT', 3);
define('MESSAGE_DEPOSIT_CLAIM', 12);

define('TRANSACTION_TYPE_ARRAY_REPORT', [0, 8]);

define('ERROR_MESSAGE', 'something went wrong');

define('MESSAGE_CREATED', 'Created successfully');
define('MESSAGE_CREATED_FAIL', 'Created unsuccessfully.');

define('MESSAGE_RECORD_NOT_FOUND', 'Record not found');
define('MESSAGE_UPDATED', 'Updated successfully');
define('MESSAGE_UPDATED_FAIL', 'Update unsuccessfully.');
define('MESSAGE_GET_SUCCESS', 'record get successfully.');



define('MESSAGE_VALIDATION_FAIL', 'Validation error');

define('MESSAGE_WITHDRAW', 'Amount withdraw successfully');
define('MESSAGE_WITHDRAW_FAIL', 'Amount withdraw unsuccessfully.');

define('MESSAGE_DEPOSIT', 'Amount deposit successfully');
define('MESSAGE_DEPOSIT_FAIL', 'Amount deposit unsuccessfully.');

define('MESSAGE_DEACTIVE', 'deactivated successfully.');
define('MESSAGE_ACTIVE', 'Activated successfully.');


define('ELASTICSEARCH_INDEX', ['users' => 'users', 'transactions' => 'transactions']);
define('ELASTICSEARCH_TYPE', '_doc');


define('DATE_FORMAT', 'Y-m-d H:i:s');


define('AGENT_EMAIL_EXIST', 'Agent email exist, Please try other email');
define('AGENT_CODENAME_EXIST', 'Agent unique code exist, Please try other name');


define('AWS_BASE_URL', 'https://fantastic-gaming-s3.s3.amazonaws.com/');

define("EVENT_LIABILITY", 1000);
define("MAX_SINGLE_BET", 250);
define("MIN_BET", 5);
define("MAX_MULTIPLE_BET", 250);
define("MAX_BET_ON_EVENT", 5000);
define("DEPOSIT_LIMIT", 10000);
define("MAX_WIN_AMOUNT", 15000);
define("MAX_ODD", 3000);
define("CASHOUT_PERCENTSGE", 5);
define("BET_DISABLED", false);
define("MAX_BONUS_WIN_AMOUNT", 40000);

define("MIN_WITHDRAWAL_AMOUNT", 10);
define("MAX_DAILY_BET_AMOUNT", 1000);
define("MAX_WEEKLY_BET_AMOUNT", 7000);
define("MAX_MONTHLY_BET_AMOUNT", 30000);

define('CRM_TEMPLATE_CATEGORY', [
  [
    'id' => 1,
    'name' => 'Upcoming Event Notification',
    'abbr' => 'upcoming_event'
  ],
  [
    'id' => 2,
    'name' => 'Promotional Notification',
    'abbr' => 'promotional'
  ],
  [
    'id' => 3,
    'name' => 'Site Maintenance Notification',
    'abbr' => 'site_maintenance'
  ],
  [
    'id' => 4,
    'name' => 'Active User Notification',
    'abbr' => 'active_user'
  ],
  [
    'id' => 5,
    'name' => 'Inactive User Notification',
    'abbr' => 'inactive_user'
  ]
]);

define('ROUTE_REQUIRED_PERMISSIONS', [
  "tenants" => [
    "R" => [
      'App\Http\Controllers\Api\TenantsController@listTenants',
      'App\Http\Controllers\Api\TenantsController@index',
      'App\Http\Controllers\Api\TenantsController@getBanners',
      'App\Http\Controllers\Api\TenantsController@show',
      'App\Http\Controllers\Api\TenantsController@getCredentials',
      'App\Http\Controllers\Api\TenantsController@tanantCurrencies',
      'App\Http\Controllers\Api\TenantsController@getTenantSportsBetSetting',
      'App\Http\Controllers\Api\TenantsController@showAdmin',
      'App\Http\Controllers\Api\PackageController@active',
      'App\Http\Controllers\Api\PackageController@index',
      'App\Http\Controllers\Api\PackageController@update',
      'App\Http\Controllers\Api\AdminController@get_roles',
      'App\Http\Controllers\Api\AdminController@get_permissions',
      'App\Http\Controllers\Api\ThemesController@index',
      'App\Http\Controllers\Api\CurrenciesController@index',
      'App\Http\Controllers\Api\SubscriberSystem\SubscriberController@show',
    ],
    "C" => [
      'App\Http\Controllers\Api\TenantsController@store',
      'App\Http\Controllers\Api\TenantsController@setCredentials',
      'App\Http\Controllers\Api\TenantsController@uploadImages',
      'App\Http\Controllers\Api\TenantsController@storeAdmin',
    ],
    "U" => [
      'App\Http\Controllers\Api\TenantsController@updateStatus',
      'App\Http\Controllers\Api\TenantsController@update',
      'App\Http\Controllers\Api\TenantsController@updateTheme',
      'App\Http\Controllers\Api\TenantsController@updateTenantSportsBetSetting',
      'App\Http\Controllers\Api\TenantsController@updateAdmin',
      'App\Http\Controllers\Api\TenantsController@updateCredentials',
    ],
    // change 2
    "disable" => [
      'App\Http\Controllers\Api\TenantsController@updateStatus',
      // 'App\Http\Controllers\Api\AdminController@destroy',
    ],

  ],
  "currencies" => [
    "C" => [
      'App\Http\Controllers\Api\CurrenciesController@store',
    ],
    "R" => [
      'App\Http\Controllers\Api\CurrenciesController@getPrimaryCurrency',
      'App\Http\Controllers\Api\CurrenciesController@index',
      'App\Http\Controllers\Api\CurrenciesController@show',
    ],
    "U" => [
      'App\Http\Controllers\Api\CurrenciesController@update',
      'App\Http\Controllers\Api\CurrenciesController@destroy',
    ],
    "mark_primary" => [
      'App\Http\Controllers\Api\CurrenciesController@markPrimary',
    ],
  ],
  "admins" => [
    "C" => [
      'App\Http\Controllers\Api\AdminController@store',
      'App\Http\Controllers\Api\SubscriberSystem\SubscriberAdminController@store'
      // 'App\Http\Controllers\Api\AdminController@store',
    ],
    "R" => [
      'App\Http\Controllers\Api\AdminController@getAdminUserTree',
      'App\Http\Controllers\Api\AdminController@getAdminAgents',
      'App\Http\Controllers\Api\AdminController@get_roles',
      'App\Http\Controllers\Api\AdminController@show',
      'App\Http\Controllers\Api\AdminController@get_permissions',
      'App\Http\Controllers\Api\AdminController@getUserPlayer',
      'WITHOUT_CONTROLLER_FUNCTION'
    ],
    "U" => [
      'App\Http\Controllers\Api\AdminController@update',
    ],
    "D" => [
      'App\Http\Controllers\Api\AdminController@getAdminAgents',
    ],
    // change 3
    "disable" => [
      'App\Http\Controllers\Api\AdminController@destroy',
    ],
  ],
  "tenant_credentials" => [
    "R" => [],
    "U" => [
      'App\Http\Controllers\Api\TenantsController@updateCredentials',
    ],
  ],
  "tenant_configurations" => [
    "R" => [
      'App\Http\Controllers\Api\CurrenciesController@getTenantsCurrencies'
    ],
  ],
  "tenant_settings" => [
    "R" => [
      'App\Http\Controllers\Api\TenantsController@getTenantSportsBetSetting',
    ],
    "U" => [
      'App\Http\Controllers\Api\TenantsController@getTenantSportsBetSettingCurrency',
      'App\Http\Controllers\Api\TenantsController@updateCrashGameSettingCurrency'
    ],
  ],
  "users" => [
    "R" => [
      'App\Http\Controllers\Api\AdminController@getUserPlayer',
     'App\Http\Controllers\Api\UserController@getPlayer',
     'App\Http\Controllers\Api\CurrenciesController@getTenantsCurrencies',
    ],
    "C"=>[
      'App\Http\Controllers\Api\UserController@store',
    ],
    "U"=>[
      'App\Http\Controllers\Api\UserController@update',
    ],
  ],
  "transactions" => [
    "R" => [
      'App\Http\Controllers\Api\CurrenciesController@index',
      'App\Http\Controllers\Api\UserController@searchUsers',
      'App\Http\Controllers\Api\UserController@getwalletsDetails',
      'App\Http\Controllers\Api\CurrenciesController@getTenantsCurrencies',
    ],
  ],
  "sport_transactions" => [
    "R" => [
      'App\Http\Controllers\Api\CurrenciesController@getTenantsCurrencies',
      'App\Http\Controllers\Api\SubscriberSystem\SubscriberController@all',
      'App\Http\Controllers\Api\SubscriberSystem\SubscriberController@getSubscriberCurrencies',
    ],
  ],
  "bet_history" => [
    "R" => [
      'App\Http\Controllers\Api\SubscriberSystem\SubscriberController@all',
      'App\Http\Controllers\Api\BetController@index',
      'App\Http\Controllers\Api\TenantsController@tanantCurrencies',
      'App\Http\Controllers\Api\BetController@show'
    ],
  ],
  "subscribers" => [
    "R" => [
      'App\Http\Controllers\Api\SubscriberSystem\SubscriberAdminController@index',
      'App\Http\Controllers\Api\SubscriberSystem\SubscriberAdminController@show',
      'App\Http\Controllers\Api\SubscriberSystem\SubscriberController@index',
      'App\Http\Controllers\Api\SubscriberSystem\SubscriberController@all',
      'App\Http\Controllers\Api\SubscriberSystem\SubscriberController@show',
      'App\Http\Controllers\Api\TenantsController@getCredentials',
      'App\Http\Controllers\Api\ThemesController@index',
      'App\Http\Controllers\Api\CurrenciesController@index',
      'App\Http\Controllers\Api\PackageController@active',
      'App\Http\Controllers\Api\PackageController@index',
      'App\Http\Controllers\Api\PackageController@update',
    ],
    "C" => [
      'App\Http\Controllers\Api\SubscriberSystem\SubscriberAdminController@store',
      'App\Http\Controllers\Api\SubscriberSystem\SubscriberController@store',
    ],
    "U" => [
      'App\Http\Controllers\Api\SubscriberSystem\SubscriberAdminController@update',
      'App\Http\Controllers\Api\SubscriberSystem\SubscriberController@update',
      'App\Http\Controllers\Api\SubscriberSystem\SubscriberController@updateStatus',
    ],
    "disable" => [
      'App\Http\Controllers\Api\SubscriberSystem\SubscriberController@updateStatus',
    ],
  ],
  "subscriber_theme_settings" => [
    "R" => ['App\Http\Controllers\Api\TenantsController@getThemeSetting',
    'App\Http\Controllers\Api\ThemesController@index',
  ],
    "U" => [],
  ],
  "subscriber_settings" => [
    "R" => [
      'App\Http\Controllers\Api\TenantsController@getTenantSportsBetSetting',
     ],
    "U" => [
      'App\Http\Controllers\Api\TenantsController@getTenantSportsBetSettingCurrency',
      'App\Http\Controllers\Api\TenantsController@updateTenantSportsBetSetting',
      // 'App\Http\Controllers\Api\TenantsController@updateCrashGameSettingCurrency'

    ],
  ],
  "subscriber_configurations" => [
    "R"=>[
      'App\Http\Controllers\Api\SubscriberSystem\SubscriberController@show',
      'App\Http\Controllers\Api\SubscriberSystem\SubscriberController@getSubscriberCurrencies',

    ],
  ],
  "subscriber_credentials" => [
    "R" => [
      // change 4
      'App\Http\Controllers\Api\TenantsController@getCredentials',
      // 'App\Http\Controllers\Api\TenantsController@show',
      'App\Http\Controllers\Api\SubscriberSystem\SubscriberController@show',
      'App\Http\Controllers\Api\SubscriberSystem\SubscriberController@all',

    ],
    "U" => [
      'App\Http\Controllers\Api\TenantsController@setCredentials',
      'App\Http\Controllers\Api\TenantsController@updateCredentials',
    ],
  ],
  "crash_game" => [

    "R" => [
      'App\Http\Controllers\Api\CrashGameController@index',
      'App\Http\Controllers\Api\SubscriberSystem\SubscriberController@all',
      'App\Http\Controllers\Api\TenantsController@tanantCurrencies'
    ],
  ],
]);

define('PERMISSIONS', [
  // subscriber start
  // "subscriber" => [
  //   "subscriber" => []],
  // subscriber end

  "super" => [
    "super_admin" => [
      // "dashboard" => ["R"],
      "tenants" => ["C", "R", "U", "disable"],
      "themes" => ["R", "U"],
      "currencies" => ["C", "R", "U", "mark_primary"],
      "admins" => ["C", "R", "U", "D"],
      "affiliates" => ["R"],
      "crm" => ["R"],
      "cms" => ["R"],
      "tenant_credentials" => ["R", "U"],
      "tenant_configurations" => ["R"],
      // "tenant_banners" => ["R"],
      "tenant_settings" => ["R", "U"],
      "users" => ["R"],
      "transactions" => ["R", "deposit", "withdrawal"],
      "sport_transactions" => ["R", "retry"],
      "advertisements" => ["R"],
      "bonus" => ["R"],
      "bet_history" => ["R", "bet_settlement"],
      "fantasy_contests" => ["R"],
      "fantasy_matches" => ["R"],
      "fantasy_players" => ["R"],
      "fantasy_teams" => ["R"],
      "sports_betting_sports" => ["R"],
      "sports_betting_countries" => ["R"],
      "sports_betting_tournaments" => ["R"],
      "sports_betting_matches" => ["R"],
      "sports_betting_markets" => ["R"],

      "subscribers" => ["R", "C", "U", "disable"],
      "subscriber_settings" => ["R", "U"],
      "slot_games" => ["R", "disable"],
      "tenant_packages" => ["R", "U"],
      "subscriber_packages" => ["R", "U"],
      "subscriber_credentials" => ["R", "U"],
      "crash_game" => ["R"]
      // "slot_theme_master" => ["R"],
      // "slot_line_master" => ["R"],
      // "slot_symbol_payout_master" => ["R"]
    ],
    // "admin" => [
    //   "dashboard" => ["R"],
    //   "tenants" => ["C", "R", "U"],
    //   "themes" => ["C", "R", "U"],
    //   "currencies" => ["C", "R", "U", "mark_primary"],
    //   "admins" => ["C", "R", "U", "D"],
    //   "affiliates" => ["R", "U"],
    //   "crm" => ["R", "U", "send_emails", "disable"],
    //   "cms" => ["R", "U", "disable"],
    //   "tenant_credentials" => ["R", "U"],
    //   "tenant_configurations" => ["R"],
    //   "tenant_banners" => ["R"],
    //   "tenant_settings" => ["R", "U"],
    //   "users" => ["R"],
    //   "transactions" => ["R"],
    //   "advertisements" => ["R", "U"],
    //   "bonus" => ["R"],
    //   "bet_history" => ["R", "bet_settlement"],
    //   "fantasy_contests" => ["R"],
    //   "fantasy_matches" => ["R"],
    //   "fantasy_players" => ["R"],
    //   "fantasy_teams" => ["R"],
    //   "sports_betting_sports" => ["R"],
    //   "sports_betting_countries" => ["R"],
    //   "sports_betting_tournaments" => ["R"],
    //   "sports_betting_matches" => ["R"],
    //   "sports_betting_markets" => ["R"],
    // ],
    // "support_staff" => [
    //   "dashboard" => ["R"],
    //   "tenants" => ["R"],
    //   "themes" => ["R"],
    //   "currencies" => ["R"],
    //   "admins" => ["R"],
    //   "affiliates" => ["R"],
    //   "crm" => ["R"],
    //   "cms" => ["R"],
    //   "tenant_credentials" => ["R"],
    //   "tenant_configurations" => ["R"],
    //   "tenant_banners" => ["R"],
    //   "tenant_settings" => ["R"],
    //   "users" => ["R"],
    //   "transactions" => ["R"],
    //   "advertisements" => ["R"],
    //   "bonus" => ["R"],
    //   "bet_history" => ["R"],
    //   "fantasy_contests" => ["R"],
    //   "fantasy_matches" => ["R"],
    //   "fantasy_players" => ["R"],
    //   "fantasy_teams" => ["R"],
    //   "sports_betting_sports" => ["R"],
    //   "sports_betting_countries" => ["R"],
    //   "sports_betting_tournaments" => ["R"],
    //   "sports_betting_matches" => ["R"],
    //   "sports_betting_markets" => ["R"],
    // ],
  ],

  "tenant" => [
    "admin" => [
      //  "dashboard" => ["R"],
      "tenants" => ["R", "U"],
      "admins" => ["C", "R", "U", "D","disable"],
      "affiliates" => ["C", "R", "U", "D"],
      "crm" => ["C", "R", "U", "D", "send_emails", "disable"],
      "cms" => ["C", "R", "U", "D", "disable"],
      "currencies" => ["R"],
      "tenant_credentials" => ["R", "U"],
      "tenant_theme_settings" => ["R", "U"],
      "tenant_configurations" => ["R"],
      // "tenant_theme_settings" => ["R", "U"],
      // "tenant_banners" => ["C", "R", "U", "D"],
      "tenant_settings" => ["R", "U"],
      "users" => ["C", "R", "U", "D"],
      "transactions" => ["R", "deposit", "withdrawal"],
      "sport_transactions" => ["R", "retry"],
      "advertisements" => ["C", "R", "U", "D"],
      "bonus" => ["C", "R", "U", "D"],
      "bet_history" => ["R", "bet_settlement"],
      "fantasy_contests" => ["C", "R", "U", "D"],
      "fantasy_matches" => ["R"],
      "fantasy_players" => ["R", "U", "disable"],
      "fantasy_teams" => ["R"],
      "sports_betting_sports" => ["R", "disable", "top_sports"],
      "sports_betting_countries" => ["R"],
      "sports_betting_tournaments" => ["R"],
      "sports_betting_matches" => ["R"],
      "sports_betting_markets" => ["R"],
      // "slot_theme_master" => ["R", "C", "U", "D"],
      // "slot_line_master" => ["R", "U"],
      // "slot_symbol_payout_master" => ["R", "U"],
      "tenant_packages" => ["R"],
      "slot_games" => ["R", "disable"],
      "crash_game" => ["R"]
    ],
    // "super_senior" => [
    //  "dashboard" => ["R"],
    //   "tenants" => ["R"],
    //   "admins" => ["C", "R", "U", "D"],
    //   "affiliates" => ["C", "R", "U", "D"],
    //   "crm" => ["C", "R", "U", "D", "send_emails", "disable"],
    //   "cms" => ["C", "R", "U", "D", "disable"],
    //   "tenant_credentials" => ["R", "U"],
    //   "tenant_theme_settings" => ["R", "U"],
    //   "tenant_configurations" => ["R"],
    //   "tenant_banners" => ["C", "R", "U", "D"],
    //   "tenant_settings" => ["R", "U"],
    //   "users" => ["R", "KYC"],
    //    => ["C", "U", "D"],
    //   "transactions" => ["R", "deposit", 'withdrawal'],
    //   "advertisements" => ["C", "R", "U", "D"],
    //   "bonus" => ["R"],
    //   "bet_history" => ["R"],
    //   "fantasy_contests" => ["C", "R", "U", "D"],
    //   "fantasy_matches" => ["R"],
    //   "fantasy_players" => ["R", "U", "disable"],
    //   "fantasy_teams" => ["R"],
    //   "sports_betting_sports" => ["R", "disable", "top_sports"],
    //   "sports_betting_countries" => ["R"],
    //   "sports_betting_tournaments" => ["R"],
    //   "sports_betting_matches" => ["R"],
    //   "sports_betting_markets" => ["R"],
    // ],
    // "senior_master" => [
    //  "dashboard" => ["R"],
    //   "tenants" => ["R"],
    //   "admins" => ["R"],
    //   "affiliates" => ["C", "R", "U", "D"],
    //   "crm" => ["C", "R", "U", "D", "send_emails", "disable"],
    //   "cms" => ["C", "R", "U", "D", "disable"],
    //   "tenant_credentials" => ["R"],
    //   "tenant_theme_settings" => ["R"],
    //   "tenant_configurations" => ["R"],
    //   "tenant_banners" => ["R"],
    //   "tenant_settings" => ["R"],
    //   "users" => ["R", "KYC"],
    //    => ["C", "U", "D"],
    //   "transactions" => ["R", "deposit", 'withdrawal'],
    //   "advertisements" => ["R"],
    //   "bonus" => ["R"],
    //   "bet_history" => ["R"],
    //   "fantasy_contests" => ["C", "R", "U", "D"],
    //   "fantasy_matches" => ["R"],
    //   "fantasy_players" => ["R"],
    //   "fantasy_teams" => ["R"],
    //   "sports_betting_sports" => ["R"],
    //   "sports_betting_countries" => ["R"],
    //   "sports_betting_tournaments" => ["R"],
    //   "sports_betting_matches" => ["R"],
    //   "sports_betting_markets" => ["R"],
    // ],
    // "master_agent" => [
    //  "dashboard" => ["R"],
    //   "tenants" => ["R"],
    //   "admins" => ["R"],
    //   "affiliates" => ["C", "R", "U", "D"],
    //   "crm" => ["C", "R", "U", "D", "send_emails", "disable"],
    //   "cms" => ["C", "R", "U", "D", "disable"],
    //   "tenant_credentials" => ["R"],
    //   "tenant_theme_settings" => ["R"],
    //   "tenant_configurations" => ["R"],
    //   "tenant_banners" => ["R"],
    //   "tenant_settings" => ["R"],
    //   "users" => ["R", "KYC"],
    //    => ["C", "U", "D"],
    //   "transactions" => ["R", "deposit", 'withdrawal'],
    //   "advertisements" => ["R"],
    //   "bonus" => ["R"],
    //   "bet_history" => ["R"],
    //   "fantasy_contests" => ["R"],
    //   "fantasy_matches" => ["R"],
    //   "fantasy_players" => ["R"],
    //   "fantasy_teams" => ["R"],
    //   "sports_betting_sports" => ["R"],
    //   "sports_betting_countries" => ["R"],
    //   "sports_betting_tournaments" => ["R"],
    //   "sports_betting_matches" => ["R"],
    //   "sports_betting_markets" => ["R"],
    // ],
    // "agent" => [
    //  "dashboard" => ["R"],
    //   "tenants" => ["R"],
    //   "admins" => ["R"],
    //   "affiliates" => ["R"],
    //   "crm" => ["R"],
    //   "cms" => ["R"],
    //   "tenant_credentials" => ["R"],
    //   "tenant_theme_settings" => ["R"],
    //   "tenant_configurations" => ["R"],
    //   "tenant_banners" => ["R"],
    //   "tenant_settings" => ["R"],
    //   "users" => ["C" ,"R", "U", "D", "KYC"],
    //    => ["C", "U", "D"],
    //   "transactions" => ["R", "deposit", 'withdrawal'],
    //   "advertisements" => ["R"],
    //   "bonus" => ["R"],
    //   "bet_history" => ["R"],
    //   "fantasy_contests" => ["R"],
    //   "fantasy_matches" => ["R"],
    //   "fantasy_players" => ["R"],
    //   "fantasy_teams" => ["R"],
    //   "sports_betting_sports" => ["R"],
    //   "sports_betting_countries" => ["R"],
    //   "sports_betting_tournaments" => ["R"],
    //   "sports_betting_matches" => ["R"],
    //   "sports_betting_markets" => ["R"],
    // ],
  ],

  "subscriber" => [
    "admin" => [
      "admins" => ["C", "R", "U", "disable"],
      "subscriber_credentials" => ["R", "U"],
      "subscriber_settings" => ["R", "U"],
      "subscriber_configurations" => ["R"],
      "subscriber_theme_settings" => ["R"],
      "subscriber_packages" => ["R"],
      "users" => ["R"],
      // "transactions" => ["R"],
      "sport_transactions" => ["R", "retry"],
      "bet_history" => ["R", "bet_settlement"],
      "fantasy_contests" => ["C", "R", "U", "D"],
      "fantasy_matches" => ["R"],
      "fantasy_players" => ["R", "U", "disable"],
      "fantasy_teams" => ["R"],
      "sports_betting_sports" => ["R", "disable", "top_sports"],
      "sports_betting_countries" => ["R"],
      "sports_betting_tournaments" => ["R"],
      "sports_betting_matches" => ["R"],
      "sports_betting_markets" => ["R"],
      // "slot_theme_master" => ["R", "C", "U", "D"],
      // "slot_line_master" => ["R", "U"],
      // "slot_symbol_payout_master" => ["R", "U"],
      "slot_games" => ["R", "disable"],
      "crash_game" => ["R"]
    ],
  ],

]);


define('PACKAGE_PERMISSIONS', [
  "FANTASY" => ["fantasy_contests", "fantasy_matches", "fantasy_players", "fantasy_teams"],
  "SPORTS_BETTING" => ["bet_history", "sports_betting_sports", "sports_betting_countries", "sports_betting_tournaments", "sports_betting_matches", "sports_betting_markets"],
  "SLOT_GAMES" => ["slot_games"]
]);


define('PERMISSION_TITLES', [
  "C" => "ACTION_BUTTON.CREATE",
  "R" => "ACTION_BUTTON.READ",
  "U" => "ACTION_BUTTON.UPDATE",
  "D" => "ACTION_BUTTON.DELETE",
  "mark_primary" => "ACTION_BUTTON.MARK_PRIMARY",
  "send_emails" => "ACTION_BUTTON.SEND_EMAILS",
  "disable" => "ACTION_BUTTON.DISABLE",
  "deposit" => "DEPOSIT",
  "withdrawal" => "WITHDRAWAL",
  "bet_settlement" => "ACTION_BUTTON.BET_SETTLEMENT",
  "player_stats" => "ACTION_BUTTON.PLAYER_STATS",
  "top_sports" => "ACTION_BUTTON.TOP_SPORTS",
  "KYC" => "KYC",
  "retry" => "RETRY"
]);

define('NON_PERMISSION_ROUTES', [
  'api/super/admin/user',
  'api/admin/user',
  'api/super/admin/tenants',
  'api/admin/tenants',
  'api/super/admin/tenants/currencies/{id}',
  'api/admin/tenants/currencies/{id}',
  'api/super/admin/dashboard/site-stats',
  'api/admin/dashboard/site-stats',
  'api/super/admin/dashboard/bet-summary',
  'api/admin/dashboard/bet-summary',
  'api/super/admin/dashboard/sport-overview',
  'api/admin/dashboard/sport-overview',
  'api/super/admin/dashboard/slot-overview',
  'api/admin/dashboard/slot-overview',
  'api/super/admin/dashboard/fantasy-overview',
  'api/admin/dashboard/fantasy-overview',
  'api/super/admin/dashboard/top-sports',
  'api/admin/dashboard/top-sports',
  'api/super/admin/dashboard/top-fantasy-leagues',
  'api/admin/dashboard/top-fantasy-leagues',
  'api/super/admin/sub-dashboard/site-stats',
  'api/admin/sub-dashboard/site-stats',
  'api/subscriber/admin/sub-dashboard/site-stats',
  'api/super/admin/sub-dashboard/bet-summary',
  'api/admin/sub-dashboard/bet-summary',
  'api/subscriber/admin/sub-dashboard/bet-summary',
  'api/super/admin/sub-dashboard/sport-overview',
  'api/admin/sub-dashboard/sport-overview',
  'api/subscriber/admin/sub-dashboard/sport-overview',
  'api/super/admin/sub-dashboard/slot-overview',
  'api/admin/sub-dashboard/slot-overview',
  'api/subscriber/admin/sub-dashboard/slot-overview',
  'api/super/admin/sub-dashboard/fantasy-overview',
  'api/admin/sub-dashboard/fantasy-overview',
  'api/subscriber/admin/sub-dashboard/fantasy-overview',
  'api/super/admin/sub-dashboard/top-sports',
  'api/admin/sub-dashboard/top-sports',
  'api/subscriber/admin/sub-dashboard/top-sports',
  'api/super/admin/sub-dashboard/top-fantasy-leagues',
  'api/admin/sub-dashboard/top-fantasy-leagues',
  'api/subscriber/admin/sub-dashboard/top-fantasy-leagues',
  'api/admin/tenants/credentials',


  //temporarily added this apis routes here
  'api/subscriber/admin/subscriber-system/game-setting-currencies',
  'api/subscriber/admin/subscriber-system/game-setting-currencies/updatecurrency/{type}/{id}/{name}',
  'api/super/admin/tenants/sports/crash-game-setting-currencies',
  'api/super/admin/tenants/crash-game-setting/updatecurrency/{type}/{id}/{name}',
  'api/super/admin/tenants/crash-game/setting',
  'api/super/admin/tenants/crash-game-setting/update',
  'api/subscriber/admin/subscriber-system/free-bet-setting/{id}',
  'api/subscriber/admin/subscriber-system/free-bet-setting/update',
  'api/super/admin/languages',
  'api/subscriber/admin/crash-game/free-bet/create',
  'api/subscriber/admin/crash-game/free-bet/list',
  'api/subscriber/admin/crash-game/free-bet/delete/{id}',
  'api/subscriber/admin/crash-game/free-bet/show/{id}',
  'api/subscriber/admin/crash-game/free-bet/update',
  'api/subscriber/admin/crash-game/free-bet/bulk-upload',
  'api/subscriber/admin/crash-game/free-bet-rain/create',
  'api/subscriber/admin/crash-game/free-bet-rain/list',
  'api/subscriber/admin/crash-game/free-bet-rain/show/{id}',
  'api/subscriber/admin/crash-game/free-bet-rain/update',
  'api/subscriber/admin/crash-game/free-bet-rain/delete/{id}',
  'api/super/admin/languages/{id}',
  'api/super/admin/languages/update/{id}',
  'api/super/admin/subscribers/admins/{id}',
  'api/super/admin/subscribers/admins/update',
  'api/super/admin/subscribers/all',
  'api/subscriber/admin/subscriber-system/usersadmin/player-status/{id}/{status}',
  'api/super/admin/languages/download-user-json/{id}',
  'api/super/admin/subscribers/hero/{id}', 
  'api/super/admin/subscribers/get-sound/{id}',
  'api/super/admin/subscribers/sound/{id}',
  'api/super/admin/organizations',
  'api/super/admin/update-password',
  'api/super/admin/subscribers/set-default',
  "api/super/admin/subscribers/{id}",
  'api/super/admin/sub-dashboard/total-players',
  'api/super/admin/sub-dashboard/bet-stats',
  'api/super/admin/sub-dashboard/total-subscribers',
  'api/subscriber/admin/subscriber-system/sub-dashboard/total-players',
  'api/subscriber/admin/subscriber-system/sub-dashboard/profit',
  'api/subscriber/admin/subscriber-system/sub-dashboard/bet-stats',
  'api/super/admin/sub-dashboard/profit',
  'api/super/admin/bet-reports',
  'api/super/admin/organization/{id}',
  'api/super/admin/organization',
  'api/subscriber/admin/admins/{id}',
  'api/subscriber/admin/admins/update',
  'api/super/admin/usersadmin/player',
  'api/subscriber/admin/crash-game/bet-history',
  'api/super/admin/crash-game/bet-history',
  'api/super/admin/usersadmin/player/status/{sub_id}/{user_id}',
  'api/subscriber/admin/subscriber-system/setting',
  'api/super/admin/organization/change-status',
  'api/super/admin/organizations/all',
  'api/super/admin/languages/list',
  'api/super/admin/currency/list',
  'api/super/admin/report/export',
  'api/super/admin/report/payment',
  'api/super/admin/report/sport',
  'api/super/admin/subscribers/org/{id}',
  'api/super/admin/sub-dashboard/total-org-players',
  'api/super/admin/sub-dashboard/total-org-subscribers',
  'api/super/admin/sub-dashboard/account-profit',
  'api/super/admin/sub-dashboard/account-total-players',
  'api/super/admin/sub-dashboard/org-profit',
  'api/super/admin/sub-dashboard/org-bets',
  'api/subscriber/admin/bet-reports',
  'api/super/admin/usersadmin/player/{id}',
  'api/subscriber/admin/subscriber-system/usersadmin/player/{id}',
  'api/super/admin/sub-dashboard/sub-bet-stats',
  'api/super/admin/sub-dashboard/org-bet-stats',
  'api/super/admin/sub-dashboard/account-bet-stats',
  'api/subscriber/admin/subscriber-system/sub-dashboard/sub-bet-stats'
]);
