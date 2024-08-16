<?php

Route::group(['prefix' => 'subscribers', 'namespace' => "SubscriberSystem"], function() {

    Route::get('/', 'SubscriberController@index');
    Route::get('/all', 'SubscriberController@all');
    Route::post('/create', 'SubscriberController@store');
    Route::post('/update', 'SubscriberController@update');
    Route::post('/update-status', 'SubscriberController@updateStatus');
    Route::get('/org/{id}', 'SubscriberController@getOrgSubscriber');
    Route::post('/hero/{id}', 'SubscriberController@updateHero');
    Route::get('/get-sound/{id}', 'SubscriberController@getSound');
    Route::post('/sound/{id}', 'SubscriberController@updateSound');
    Route::get('/set-default', 'SubscriberController@setDefault');
    Route::get('/{id}', 'SubscriberController@show');
    Route::get('/bet-reports', 'Reports\BetReportController@'.'getSubBetReports');

});
