<?php

Route::group(["prefix" => 'admins'], function() {

  Route::post('/', 'AdminController@getAdminAgents');

  Route::group([ 'namespace' => "SubscriberSystem"], function() {
 
      Route::post('/create', 'SubscriberAdminController@store');
      Route::post('/update', 'SubscriberAdminController@updatePassword');
      Route::get('/{id}', 'SubscriberAdminController@show');
      
  });

});
