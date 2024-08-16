<?php

Route::group(['prefix' => 'dashboard'], function(){
    
    Route::get('/tenants/currencies/{id}','TenantsController@tanantCurrencies');

});
