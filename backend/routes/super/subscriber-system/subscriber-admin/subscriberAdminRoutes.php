<?php

Route::group(['prefix' => 'subscribers/admins', 'namespace' => "SubscriberSystem"], function() {
 
    Route::get('/data', 'SubscriberAdminController@index');
    Route::post('/create', 'SubscriberAdminController@store');
    Route::post('/update', 'SubscriberAdminController@update');
    Route::get('/{id}', 'SubscriberAdminController@show');

});
