<?php

Route::group(['prefix' => 'languages'], function() {
Route::post('/list','LanguagesController@index');
Route::get('/{id}','LanguagesController@show');
Route::post('/','LanguagesController@store');
Route::post('/update/{id}','LanguagesController@update');
Route::delete('/{id}','LanguagesController@destroy');
Route::get('/download-user-json/{id}','LanguagesController@downloadJson');

});
