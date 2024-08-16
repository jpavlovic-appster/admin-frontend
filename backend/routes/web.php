<?php

use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

//Route::get('/', function () {
//    return view('welcome');
//});
Route::get('/', function (Request $request) {
    return response()->json(['success'=>1,'message'=>'Welcome to Backend API '.env('APP_NAME'),'record'=>[]]);
});


Route::get('/reindex-user/{id?}', 'ReindexESUsersController@reIndexUsers');
