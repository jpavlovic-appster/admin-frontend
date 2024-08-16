<?php

Route::group(['prefix' => 'crash-game'], function() {

    

    Route::group(['prefix' => 'bet-history'], function() {
        Route::get('/', 'CrashGameController@index');
        Route::post('/', 'CrashGameController@showBets');

    });

});
