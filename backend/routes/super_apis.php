<?php
/* currencies CRUD API*/
require_once "super/currencies/currenciesRoutes.php";

/* currencies CRUD API*/
require_once "super/users/index.php";

// bet report
Route::get('/bet-reports', 'Reports\BetReportController@'.'getBetReports');

// Bet
require_once "super/crash-game/crashgameRoutes.php";

/* Languages CRUD API*/
require_once "super/languages/languagesRoutes.php";


/* Tenants CRUD API*/

require_once "super/tenants/tenantsRoute.php";

// Subscribers Routes
require_once "super/subscriber-system/subscribers/subscribersRoutes.php";

// Subscribers Admin Routes
require_once "super/subscriber-system/subscriber-admin/subscriberAdminRoutes.php";

Route::post('/aws/get/url','AdminController@getAWSUrl');


// Subscriber Dashboard Routes
Route::group(['prefix' => 'sub-dashboard'], function(){
  Route::post('total-players', 'SubscriberDashboardController@total_players');
  Route::post('bet-stats', 'SubscriberDashboardController@betStats');
  Route::post('account-bet-stats', 'SubscriberDashboardController@subscriberBetStats');
  Route::post('total-subscribers', 'SubscriberDashboardController@total_subscribers');
  Route::post('total-org-players', 'SubscriberDashboardController@total_org_players');
  Route::post('total-org-subscribers', 'SubscriberDashboardController@total_org_subscribers');
  Route::post('account-total-players', 'SubscriberDashboardController@sub_total_players');
  Route::post('org-bet-stats', 'SubscriberDashboardController@orgBetStats');

});


// Report Routes
Route::group(['prefix' => 'report'], function(){
  Route::get('bets', 'Reports\BetReportController@report');
});
