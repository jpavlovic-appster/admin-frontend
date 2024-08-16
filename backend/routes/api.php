<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

/**
 * Welcome Message
 */
Route::get('/', function (Request $request) {
    return response()->json(['success'=>1,'message'=>'Welcome to Backend API '.env('APP_NAME'),'record'=>[]]);
});

Route::get('/health-check', function (Request $request) {
    return response()->json(['message'=>'OK']);
});


Route::group(['middleware' => ['api', 'cors'],'prefix' => '/login/','namespace' => 'Api'], function() {
    Route::get('/check-tensub','TenantsController@checkTenSub');
    Route::post('super', 'LoginController@superAdminlogin')->name('superAdminlogin');
    Route::post('admin', 'LoginController@login')->name('login');
    Route::post('subscriber', 'LoginController@subscriberAdminlogin')->name('subscriberAdminlogin');
});


//Login Routes
//Route::middleware('auth:api')->get('/users/{id?}','Api\LoginController@show');
//Route::middleware('auth:api')->post('/user','Api\LoginController@profileUpdate');


//Logout Routes
Route::middleware(['auth:superapi', 'cors'])->post('/logout/admin/super','Api\LoginController@adminSuperLogout');
Route::middleware(['auth:adminapi', 'cors'])->post('/logout/admin','Api\LoginController@adminLogout');
Route::middleware(['auth:subscriberapi', 'cors'])->post('/logout/subscriber','Api\LoginController@subscriberLogout');



//Super Admin Route
Route::group(['prefix' => 'super/admin/','middleware' => ['auth:superapi','superadmin','cors'], 'namespace' => 'Api'], function(){
    Route::get('/', function (Request $request) {
        return response()->json(['success'=>1,'message'=>'Welcome to Backend Super Admin API '.env('APP_NAME'),'record'=>[]]);
    });
    Route::get('/user', function() {
        return response()->json(['success'=>1,'message'=>'','record'=>request()->user()]);
    });
    

    Route::get('get-roles/{type}', 'AdminController@get_roles');
    Route::get('get-permissions', 'AdminController@get_permissions');


    include_once ('super_apis.php');
});
Route::get('/languages','Api\LanguagesController@index');


// Subscriber Admin Route
Route::group(['prefix' => 'subscriber/admin/','middleware' => ['auth:subscriberapi','subscriber','cors'], 'namespace' => 'Api'], function() {

    Route::get('/', function (Request $request) {
        return response()->json(['success'=>1,'message'=>'Welcome to Backend Super Admin API '.env('APP_NAME'),'record'=>[]]);
    });

    Route::get('/user', function() {
        $data = request()->user();
        $data->roles = $data->role->first()->abbr;
        $data->subscriber = getSubscriberDetails($data->subscriber_id);
        return response()->json(['success'=> 1, 'message'=>'', 'record' => request()->user()]);
    });

    include_once ('subscriber_apis.php');
});

Route::group(['namespace' => 'Api'], function () {
    Route::post('subscriber/forgot-password', 'LoginController@subscriberAdminForgotPassword')->name('subscriberAdminForgotPassword');
    Route::post('subscriber/reset-password', 'LoginController@subscriberAdminResetPassword')->name('subscriberAdminResettPassword');
    Route::get('subscriber/check-token/{token}', 'LoginController@subscriberAdminCheckResetPasswordToken')->name('subscriberAdminCheckResetPasswordToken');

Route::get('report/export', 'Reports\BetReportController@exportReport');
});
