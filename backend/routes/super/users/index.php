<?php


Route::post('/users','AdminController@index'); //for admin Users
Route::get('/users/all','AdminController@getAdmins');
Route::get('/users/{id}','AdminController@show');
Route::post('/usersadmin/add/','AdminController@store');
Route::post('/usersadmin/edit/{id}','AdminController@update');
Route::delete('/users/{id}','AdminController@destroy');
Route::post('/usersadmin/agent','AdminController@getAdminAgents');
Route::post('/usersadmin/player','AdminController@getUserPlayer');
Route::get('/usersadmin/player/{id}','AdminController@getPlayerDetail');
Route::get('/usersadmin/player/status/{sub_id}/{user_id}','AdminController@getPlayerStatus');




