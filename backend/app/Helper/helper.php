<?php

use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\DB;
use App\Mail\CommonEmail;
use App\Models\AdminUsersAdminRoles;
use Illuminate\Support\Facades\Auth;
//Load models
use App\Models\User;
use App\Models\Admin;
use App\Models\AdminRole;
use App\Models\SuperRole;
use App\Models\Wallets;
use App\Models\SportsBetSetting;
use App\Models\TenantThemeSettings;
use App\Models\Currencies;
use App\Models\SubscriberSystem\Subscriber;
// use App\Models\SuperAdminWallets;
use Illuminate\Support\Facades\Redis;

global $dateTime;

$dateTime = '2020-12-30 00:00:00';

/**
 *
 * @description errorArrayCreate
 */

    if(! function_exists('getDomain')) {
        function getDomain($domain) {
            // $pieces = parse_url($url);
            // $domain = isset($pieces['host']) ? $pieces['host'] : '';
            if (preg_match('/(?P<domain>[a-z0-9][a-z0-9\-]{1,63}\.[a-z\.]{2,6})$/i', $domain, $regs)) {
                return $regs['domain'];
            }
            return 'localhost:4200';
        }
    }

 if(! function_exists('setRedisCredentials')) {
    function setRedisCredentials($rkey, $type, $key, $value) {

        try {
            // dd('hi');
            
            if($key == "OPERATOR_DEBIT_API" || $key == "OPERATOR_CREDIT_API" || $key == "OPERATOR_PROFILE_API" || $key == "OPERATOR_SUCCESS_API" || $key == "SECRET_KEY") {

                $redis = Redis::connection();

                $jsonArray = json_decode( $redis->get($rkey), true );

                if($key == "OPERATOR_DEBIT_API") {
                    $jsonArray['debit'] = $value;
                }

                if($key == "OPERATOR_CREDIT_API") {
                    $jsonArray['credit'] = $value;
                }

                if($key == "OPERATOR_PROFILE_API") {
                    $jsonArray['getUserBalance'] = $value;
                }

                if($key == "OPERATOR_SUCCESS_API") {
                    $jsonArray['successCallback'] = $value;
                }

                if($key == "SECRET_KEY") {
                    $jsonArray['secretKey'] = $value;
                }

                $redis->set($rkey, json_encode($jsonArray) );

                // return json_decode( $redis->get($rkey), true );

            }

        } catch(\Exception $e) {
            // throw $e;
        }

    }
}

if (! function_exists('errorArrayCreate'))
{
    function errorArrayCreate($obj)
    {
        try
        {
            $obj    = $obj->toArray();
            $errors = array();
            if( is_array($obj) && !empty($obj))
            {
                foreach($obj as $k => $v)
                {
                    if( count($v) > 1 )
                    {
                        $err = '';
                        foreach ($v as $value)
                        {
                            $err.= $value.' && ';
                        }
                        trim($err,'&&');
                        $errors[$k] = $err;
                    }
                    else
                    {
                        $errors[$k] = $v[0];
                    }
                }
            }
            return $errors;
        }
        catch(\Exception $e){
            throw $e;
        }
    }
}


if(! function_exists('du'))
{
    function du($array) {
        echo "<pre>";
        print_r($array);
        die;
    }

}

if(! function_exists('datetimest'))
{
    function datetimest()
    {
        date_default_timezone_set(env('timezone'));
        return $currentDate =Date('Y-m-d H:i:s');
    }
}

if (! function_exists('nextDate'))
{
    function nextDate($days=1)
    {
        $startDate = time();
        date_default_timezone_set(env('timezone'));
        return $currentDate=date('Y-m-d H:i:s', strtotime('+'.$days.' day', $startDate));
    }
}


if (! function_exists('sendEmail')) {
    function sendEmail($view,$email,$data) {
        if (view()->exists('email_template.'.$view)) {
            $data['view'] = $view;
            return Mail::to($email)
                ->send(new CommonEmail($data));
        }else{
            return false;
        }
    }
}

if (! function_exists('returnResponse')) {
    function returnResponse($result=true,$message="Record fetch successfully",$record=[],$resCode=200,$count=false) {
        try {
        $responseArray=array();
        if($result===true){
            $responseArray['success']=1;
        } else{
            $responseArray['success']=0;
        }
        $responseArray['message']=$message;
        $responseArray['record']=$record;

        if(!$count)
        $responseArray['count'] = count($record);

        }catch (Exception $e){
//            $responseArray['success']=0;
//            $responseArray['message']=$message .' '.$e->getMessage();
        }
//        du($responseArray);
        return response()->json($responseArray, $resCode);

    }
}

/**
 * @param $url
 * @param string $method
 * @param array $post_parameters
 */
function background_curl_request($url, $method='get', $post_parameters =[],$storeId=''){
    if (is_array($post_parameters)){
        $params = "";
        foreach ($post_parameters as $key=>$value){
            $params .= $key."=".urlencode($value).'&';
        }
        $params = rtrim($params, "&");
    } else {
        $params = $post_parameters;
    }
    $path="/var/log/app/store_".$storeId."_".date('y-m-d_h:i:s').".json";
    $command = "/usr/bin/curl -X '".$method."' -d '".$params."' --url '".$url."' >> $path 2> /dev/null &";
//    du($command);
    exec($command);
}


function removeSpecialChar($string) {
    $string = str_replace(' ', '', $string);

    $string = preg_replace('/[^A-Za-z0-9\-]/', '_', $string);
    return $string;
}


if (! function_exists('getWalletDetails')) {
    function getWalletDetails($id, $type = ""){
        if($id==''){
            return ;
        }
        // if($type == ADMIN_TYPE){
            $wallets = Wallets::select(['amount', 'currency_code', 'symbol as currency_symbol',  (new Wallets)->getTable().'.id as id', 'non_cash_amount', 'owner_id', 'owner_type', 'winning_amount' , (new Currencies)->getTable().".id as currency_id"])
            ->join((new Currencies)->getTable(), (new Wallets)->getTable().'.currency_code' , '=', (new Currencies)->getTable().'.code');
            $wallets = $wallets->where('owner_type', $type);
            $wallets =  $wallets->where('owner_id',$id)->get();
        // }else if($type == SUPER_ADMIN_TYPE){
        //     $wallets = Wallets::select(['amount', 'currency_code', 'symbol as currency_symbol', (new SuperAdminWallets)->getTable().'.id as id', 'non_cash_amount', 'super_admin_user_id as owner_id' , (new Currencies)->getTable().".id as currency_id"])
        //     ->join((new Currencies)->getTable(), (new SuperAdminWallets)->getTable().'.currency_code' , '=', (new Currencies)->getTable().'.code');
        //     $wallets =  $wallets->where('super_admin_user_id',$id)->get();
        // }
        return $wallets;
    }
}

if (! function_exists('getRolesDetails')) {

    function getRolesDetails($id=''){

        if($id==''){
            $id=Auth::user()->id;
        }

        $roles=AdminUsersAdminRoles::where('admin_user_id',$id)->select('admin_role_id')->get();
        $rolesArray = [];

        if($roles && $roles->toArray()) {
            foreach ($roles->toArray() as $key => $value) {
                    // $rolesArray[] = $value['admin_role_id'];
                if ($value['admin_role_id'] == 1)
                    // $rolesArray['owner'] = $value['admin_role_id'];
                    $rolesArray[] = 'owner';

                if ($value['admin_role_id'] == 2)
                    // $rolesArray['agent'] = $value['admin_role_id'];
                    $rolesArray[] = 'agent';
            }
        }

        return $rolesArray;
    }
}

if (!function_exists('getTenantDetails')) {

    function getTenantDetails($id = '')
    {

        $tenant = \App\Models\Tenants::select('tenants.domain', 'tenants.name' ,'tts.logo_url', 'primary_currency',
            'TSS.id as sports_bet_setting_id')
            ->leftJoin((new TenantThemeSettings)->getTable().' as tts', 'tts.tenant_id', '=', 'tenants.id')
            ->leftJoin((new SportsBetSetting)->getTable().' as TSS', 'TSS.tenant_id', '=', 'tenants.id')
            ->where('tenants.id', '=', $id)
            ->first();

        return @$tenant;
    }
}

if (!function_exists('getSubscriberDetails')) {

    function getSubscriberDetails($id = '') {

        $subscriber = DB::table((new Subscriber)->getTable().' as s')->select(['s.domain', 's.subscriber_name', 'primary_currency'])
            ->where('s.id', '=', $id)
            ->first();

        return @$subscriber;
    }
}

function getUserStatusString($status) {
    $str = '';
    switch($status) {
        case 0: $str =  'InActive'; break;
        case 1: $str =  'Active'; break;
        default: $str =  'NA';
    }
    return $str;
}


function getTransactionTypeString($transactionType) {
     $str = '';
    switch ($transactionType) {
        case 0: $str =  'BET'; break;
        case 1: $str =  'WIN'; break;
        case 2: $str =  'REFUND'; break;
        case 3: $str =  'DEPOSIT'; break;
        case 4: $str =  'WITHDRAW'; break;
        case 5: $str =  'NON_CASH_GRANTED_BY_ADMIN'; break;
        case 6: $str =  'NON_CASH_WITHDRAW_BY_ADMIN'; break;
        case 7: $str =  'TIP'; break;
        case 8: $str =  'BET_NON_CASH'; break;
        case 9: $str =  'WIN_NON_CASH'; break;
        case 10: $str =  'REFUND_NON_CASH'; break;
        case 11: $str =  'NON_CASH_BONUS_CLAIM'; break;
        case 12: $str =  'DEPOSIT_BONUS_CLAIM'; break;
        case 13: $str =  'TIP_NON_CASH'; break;
        case 14: $str =  'WITHDRAW_CANCEL'; break;
        default: $str =  'NA'; break;
    }
    return $str;

}

function checkEmailForTenant($email,$tenant_id,$type) {
    if($type == "player") {
        $result =  User::where('tenant_id',$tenant_id)->where('email',$email)->select('id')->get();
    }else{
        $result =  Admin::where('tenant_id',$tenant_id)->where('email',$email)->select('id')->get();
    }
    return $result->count();
}

function checkUniCodeNameForTenant($name, $tenant_id, $type) {
  if($type == "player") {
        $result =  User::where('tenant_id',$tenant_id)->where('user_name',$name)->select('id')->get();
  }else{
        $result =  Admin::where('tenant_id',$tenant_id)->where('agent_name',$name)->select('id')->get();
  }
  return $result->count();
}

function time_machine($date = 'today', $format = 'Y-m-d H:i'){

    if(empty($GLOBALS['dateTime'])){
        return date($format, strtotime($date));
    }

    return date($format, strtotime($GLOBALS['dateTime']));

}

function random_string($type = 'alnum', $len = 8)
{
	switch ($type)
	{
		case 'basic':
			return mt_rand();
		case 'alnum':
		case 'numeric':
		case 'nozero':
		case 'alpha':
			switch ($type)
			{
				case 'alpha':
					$pool = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
					break;
				case 'alnum':
					$pool = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
					break;
				case 'numeric':
					$pool = '0123456789';
					break;
				case 'nozero':
					$pool = '123456789';
					break;
			}
			return substr(str_shuffle(str_repeat($pool, ceil($len / strlen($pool)))), 0, $len);
		case 'unique': // todo: remove in 3.1+
		case 'md5':
			return md5(uniqid(mt_rand()));
		case 'encrypt': // todo: remove in 3.1+
		case 'sha1':
			return sha1(uniqid(mt_rand(), TRUE));
	}



}

if (! function_exists('get_super_roles')) {
    function get_super_roles(){
        return SuperRole::all();
    }
}

if (! function_exists('get_admin_roles')) {
    function get_admin_roles(){
        return AdminRole::all();
    }
}
