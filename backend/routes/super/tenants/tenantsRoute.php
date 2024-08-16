<?php
Route::post('update-password', 'TenantsController@updatePassword');

Route::get('/tenants/currencies/{id}','TenantsController@tanantCurrencies');

Route::get('/tenants/crash-game/setting','TenantsController@getTenantCrashGameSetting');
Route::post('/tenants/crash-game-setting/update','TenantsController@updateTenantCrashGameSetting');

Route::get('tenants/sports/crash-game-setting-currencies','TenantsController@getTenantCrashGameBetSettingCurrency');
Route::post('/tenants/crash-game-setting/updatecurrency/{type}/{id}/{name}','TenantsController@updateCrashGameSettingCurrency');

Route::post('organizations', 'TenantsController@createOrganization');
Route::get('organizations', 'TenantsController@getOrganizations');
Route::get('organization/{id}', 'TenantsController@getOrganization');
Route::post('organization', 'TenantsController@updateOrganization');
Route::delete('organization/{id}', 'TenantsController@deleteOrganization');
Route::post('organization/change-status', 'TenantsController@updateOrganizationStatus');
Route::post('organizations/all', 'TenantsController@getOrganizationsAll');

