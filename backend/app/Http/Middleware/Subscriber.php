<?php

namespace App\Http\Middleware;

use App\Models\SubscriberSystem\Subscriber as SubscriberSystemSubscriber;
use Closure;
use Illuminate\Http\Request;
use App\Models\SubscriberSystem\SubscriberAdminUserPermission;

class Subscriber
{
    //route permissions array defined in constants
    private $routes_req_permissions = ROUTE_REQUIRED_PERMISSIONS;
    /**
     * Handle an incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure  $next
     * @return mixed
     */
    public function handle(Request $request, Closure $next)
    {

        $userData = request()->user();
        $loginUserRole = $userData->role->first();
        $requestRole = $request->headers->get('Role');
        $subscriber = SubscriberSystemSubscriber::where('id', $userData->subscriber_id)->first();
        // dd($subscriber);
        if($subscriber->status != 1) {
            return returnResponse(false, 'deactivated subscriber' , [  ], 401);
        }
        if(!$userData->active) {
            return returnResponse(false, $userData->first_name." ".$userData->last_name .'account is not active', [  ], 401);
        }

        if($loginUserRole->abbr === $requestRole) {

            if(!in_array($request->route()->uri, NON_PERMISSION_ROUTES)){

                if(!$request->headers->has('CP')){
                    return returnResponse(false, 'Permissions not found in request', [], 400);
                }

                $CP = explode('|:|', base64_decode(base64_decode($request->headers->get('CP'))));

                $action = $CP[0];
                $permissions = $CP[1];

                $loggedinUserPermissions = SubscriberAdminUserPermission::where('admin_user_id', $userData->id)
                ->where('action', $action)
                ->first();
                //api using function
                // dd($request->route());   
                try {
                    $function_called = $request->route()->action['controller'];
                } catch (\Throwable $th) {
                    $function_called = 'WITHOUT_CONTROLLER_FUNCTION';
                }
                
                try {
                    
                    //permision provided by user has acces to that function
                $required_permission = $this->routes_req_permissions[$action][$permissions];
                } catch (\Throwable $th) {
                    return returnResponse(false, 'You are not authorized to make this request', [], 400);
                }
                $loggedinUserPermissions = json_decode($loggedinUserPermissions->permission);

                if(in_array($permissions, $loggedinUserPermissions)  && in_array($function_called, $required_permission)){
                    return $next($request);
                }else{
                    // dd($function_called);
                    return returnResponse(false, 'You are not authorized to make this request', [], 400);
                }
            }else{
                return $next($request);
            }

        }else{
            return returnResponse(false, 'Request Role and Admin Role does not match',[],401);
        }
    }
}
