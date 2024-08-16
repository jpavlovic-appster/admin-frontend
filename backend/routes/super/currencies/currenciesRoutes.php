<?php
/* currencies CRUD API*/
Route::get('/primary-currency','CurrenciesController@getPrimaryCurrency');
Route::post('/currency/list','CurrenciesController@getAllCurrency');
Route::get('/currencies','CurrenciesController@index');
Route::get('/currencies/{id}','CurrenciesController@show');
Route::post('/currency','CurrenciesController@store');
Route::post('/currency/{id}','CurrenciesController@update');
Route::delete('/currency/{id}','CurrenciesController@destroy');
Route::get('/mark-primary/{id}','CurrenciesController@markPrimary');

