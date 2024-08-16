<?php

Route::group(['prefix' => 'crash-game'], function() {



    Route::group(['prefix' => 'bet-history'], function() {

        Route::get('/', 'CrashGameController@index');
        Route::post('/', 'CrashGameController@showBets');

    });
    Route::group(['prefix' => 'free-bet'], function() {

        Route::post('/create', 'CrashGameController@createFreeBet');
        Route::post('/list', 'CrashGameController@getFreeBet');
        Route::get('/delete/{id}', 'CrashGameController@deleteFreeBet');
        Route::get('/show/{id}', 'CrashGameController@showFreeBet');
        Route::post('/update', 'CrashGameController@updateFreeBet');
        Route::post('/bulk-upload', 'CrashGameController@bulkUpload');
    });

    Route::group(['prefix' => 'free-bet-rain'], function() {

        Route::post('/create', 'CrashGameController@createFreeBetRain');
        Route::post('/list', 'CrashGameController@getFreeBetRain');
        Route::get('/show/{id}', 'CrashGameController@showFreeBetRain');
        Route::post('/update', 'CrashGameController@updateFreeBetRain');
        Route::get('/delete/{id}', 'CrashGameController@deleteFreeBetRain');
    });

});
