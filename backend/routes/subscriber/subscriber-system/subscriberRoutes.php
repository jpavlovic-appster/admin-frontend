<?php

Route::group(['prefix' => 'subscriber-system'], function() {
  
    Route::post('/sub-dashboard/sub-bet-stats', 'SubscriberDashboardController@subscriberBetStats');
    Route::post('/sub-dashboard/total-players', 'SubscriberDashboardController@sub_total_players');
    // Route::get('helloworld', 'TenantsController@getTenantSportsBetSettingCurrency');
    Route::get('/sport-setting-currencies','TenantsController@getTenantSportsBetSettingCurrency');
    Route::post('/sport-setting/updatecurrency/{type}/{id}/{name}','TenantsController@updateTenantSportsBetSettingcurrency');

    Route::get('/setting','TenantsController@getTenantCrashGameSetting');

    Route::post('/game-setting-currencies/updatecurrency/{type}/{id}/{name}','TenantsController@updateCrashGameSettingCurrency');

    Route::get('/game-setting-currencies','TenantsController@getTenantCrashGameBetSettingCurrency');

    Route::post('/credentials','TenantsController@setCredentials');
    Route::post('/credentials/edit/{id}','TenantsController@updateCredentials');

    Route::get('/free-bet-setting/{id}','TenantsController@getFreeBetSetting');
    Route::post('/free-bet-setting/update','TenantsController@updateFreeBetSetting');

    Route::get('/theme-setting','TenantsController@getThemeSetting');
    Route::post('/theme-setting-update','TenantsController@updateThemeSetting');

    Route::get('/credentials','TenantsController@getCredentials');
    Route::get('/sport-setting','TenantsController@getTenantSportsBetSetting');
    Route::post('/sport-setting/update/{id}','TenantsController@updateTenantSportsBetSetting');

    Route::group(['namespace' => "SubscriberSystem"], function() {

        Route::get('/currencies','SubscriberController@getSubscriberCurrencies');
        Route::get('/{id}', 'SubscriberController@show');

    });
    Route::post('/usersadmin/player','AdminController@getUserPlayer');
    Route::get('/usersadmin/player/{id}','AdminController@getPlayerDetail');
    Route::put('/usersadmin/player-status/{id}/{status}','AdminController@updateUserStatus');


});
