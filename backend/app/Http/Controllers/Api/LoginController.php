<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Jobs\SubscriberAdminChangePasswordMail;
use App\Jobs\SubscriberAdminResetPasswordMail;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Validator;
use Illuminate\Http\Response;
use App\Models\Admin;
use App\Models\Super;
use App\Models\Tenants;
use App\Models\Affiliate;
use App\Models\SubscriberSystem\Subscriber;
use App\Models\SubscriberSystem\SubscriberAdmin;
use Carbon\Carbon;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\DB;
use Laravel\Passport\Client as OClient;
use GuzzleHttp\Client;
use Illuminate\Support\Facades\Mail;

class LoginController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        //
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id = '')
    {
        if ($id == '') {
            return returnResponse(true, "Record get Successfully", User::all());
        } else {

            return returnResponse(true, "Record get Successfully", User::find($id));
        }
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        //
    }

    /**
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function login(Request $request)
    {

        $messages = [
            'email.required' => 'VALIDATION_MSGS.EMAIL.REQUIRED',
            'email.email' => 'VALIDATION_MSGS.EMAIL.VALID',
            'password.required' => 'VALIDATION_MSGS.PASSWORD.REQUIRED'
        ];

        $validator = Validator::make($request->all(), [
            'email' => 'required|email',
            'password' => 'required',
        ], $messages);

        if ($validator->fails()) {
            return returnResponse(false, '', $validator->errors(), 400);
        }

        if (Auth::guard('admin')->attempt(['email' => $request->email, 'password' => base64_decode($request->password)], $request->remember_me)) {

            $user = Auth::guard('admin')->user();

            $tenant = Tenants::select(['status', 'domain'])->where('id', $user->tenant_id)->first();

            $tenantDomain = preg_replace("(^https?://)", "", $tenant->domain);

            $domain = getDomain($request->getHttpHost());

            if ($tenantDomain != $domain && !str_contains($request->getHttpHost(), env('DEV_URL'))) {
                return returnResponse(false, 'SENTENCES.UNAUTHORIZED', [], 403);
            }

            if ($tenant->status == 0 || $tenant->status == 3) {
                return returnResponse(false, 'SENTENCES.TENANT_INACTIVE', [], 400);
            }

            if (Admin::select(['active'])->where('email', $request->email)->first()->active ? false : true) {
                return returnResponse(false, 'SENTENCES.ADMIN_INACTIVE', [], 400);
            }

            $success['token_type'] = 'Bearer';
            $success['token'] =  $user->createToken(env('APP_NAME' . "_admin"))->accessToken;
            $success['user'] = $user;
            //dd('akfdjkfjdk');
            $success['user']->roles = $user->role->first()->abbr;

            return returnResponse(true, 'SENTENCES.LOGIN_SUCCESS', $success);
        } else {
            return returnResponse(false, 'SENTENCES.UNAUTHORIZED', [], 403);
        }
    }

    public function superAdminlogin(Request $request)
    {

        $messages = [
            'email.required' => 'VALIDATION_MSGS.EMAIL.REQUIRED',
            'email.email' => 'VALIDATION_MSGS.EMAIL.VALID',
            'password.required' => 'VALIDATION_MSGS.PASSWORD.REQUIRED'
        ];

        $validator = Validator::make($request->all(), [
            'email' => 'required|email',
            'password' => 'required',
        ], $messages);

        if ($validator->fails()) {
            return returnResponse(false, '', $validator->errors(), 400);
        }
        if ( Auth::guard('super')->attempt(['email' => $request->email, 'password' => base64_decode($request->password)], $request->remember_me)) {

            if (Super::select(['active'])->where('email', $request->email)->first()->active ? false : true) {
                return returnResponse(false, 'SENTENCES.ADMIN_INACTIVE', [], 400);
            }

            $user = Auth::guard('super')->user();
            $success['token_type'] = 'Bearer';
            $success['token'] =  $user->createToken(env('APP_NAME' . "_superadmin"))->accessToken;
            $success['user'] = $user;
            $success['user']->roles = $user->role->first()->abbr;
            // $success['user']->wallets = $user->wallets;

            return returnResponse(true, 'SENTENCES.LOGIN_SUCCESS', $success);
        } else {
            return returnResponse(false, 'SENTENCES.UNAUTHORIZED', [], 403);
        }
    }

    public function subscriberAdminlogin(Request $request)
    {

        $messages = [
            'email.required' => 'VALIDATION_MSGS.EMAIL.REQUIRED',
            'email.email' => 'VALIDATION_MSGS.EMAIL.VALID',
            'password.required' => 'VALIDATION_MSGS.PASSWORD.REQUIRED'
        ];

        $validator = Validator::make($request->all(), [
            'email' => 'required|email',
            'encrypt_password' => 'required',
        ], $messages);

        if ($validator->fails()) {
            return returnResponse(false, '', $validator->errors(), 400);
        }

        if (Auth::guard('subscriber')->attempt(['email' => $request->email, 'password' => base64_decode($request->encrypt_password)], $request->remember_me)) {

            $user = Auth::guard('subscriber')->user();

            $subscriber = Subscriber::select(['status', 'domain'])->where('id', $user->subscriber_id)->first();

            $subscriberDomain = preg_replace("(^https?://)", "", $subscriber->domain);

            $domain = getDomain($request->getHttpHost());

            // if ($subscriberDomain != $domain && !str_contains($request->getHttpHost(), env('DEV_URL'))) {
            //     return returnResponse(false, 'SENTENCES.UNAUTHORIZED', [], 403);
            // }

            if ($subscriber->status == 0 || $subscriber->status == 3) {
                return returnResponse(false, 'SENTENCES.SUBSCRIBER_INACTIVE', [], 400);
            }

            if (SubscriberAdmin::select(['active'])->where('email', $request->email)->first()->active ? false : true) {
                return returnResponse(false, 'SENTENCES.ADMIN_INACTIVE', [], 400);
            }
            $subscriber = Subscriber::select(['language'])->where('id', $user->subscriber_id)->first();
            $success['token_type'] = 'Bearer';
            $success['token'] =  $user->createToken(env('APP_NAME' . "_subscriberadmin"))->accessToken;
            $success['user'] = $user;
            $success['user']->roles = $user->role->first()->abbr;
            $success['user']->subscriber = getSubscriberDetails($user->subscriber_id);
            $success['language'] = $subscriber->language;

            return returnResponse(true, 'SENTENCES.LOGIN_SUCCESS', $success);
        } else {
            return returnResponse(false, 'SENTENCES.UNAUTHORIZED', [], 403);
        }
    }

    public function affiliateLogin(Request $request)
    {

        $messages = [
            'email.required' => 'VALIDATION_MSGS.EMAIL.REQUIRED',
            'email.email' => 'VALIDATION_MSGS.EMAIL.VALID',
            'password.required' => 'VALIDATION_MSGS.PASSWORD.REQUIRED'
        ];

        $validator = Validator::make($request->all(), [
            'email' => 'required|email',
            'password' => 'required',
        ], $messages);

        if ($validator->fails()) {
            return returnResponse(false, '', $validator->errors(), 400);
        }

        if (Auth::guard('affiliate')->attempt(['email' => $request->email, 'password' => base64_decode($request->password)], $request->remember_me)) {

            $user = Auth::guard('affiliate')->User();

            $tenant = Tenants::select(['status', 'domain'])->where('id', $user->tenant_id)->first();

            $tenantDomain = preg_replace("(^https?://)", "", $tenant->domain);

            $domain = getDomain($request->getHttpHost() && !str_contains($request->getHttpHost(), env('DEV_URL')));

            if ($tenantDomain != $domain) {
                return returnResponse(false, 'SENTENCES.UNAUTHORIZED', [], 403);
            }

            if ($tenant->status == 0 || $tenant->status == 3) {
                return returnResponse(false, 'SENTENCES.TENANT_INACTIVE', [], 400);
            }

            if (Affiliate::select(['active'])->where('email', $request->email)->first()->active ? false : true) {
                return returnResponse(false, 'SENTENCES.ADMIN_INACTIVE', [], 400);
            }

            $success['token_type'] = 'Bearer';
            $success['token'] =  $user->createToken(env('APP_NAME' . "_affiliate"))->accessToken;
            $success['user'] = $user;
            $success['user']->roles = "affiliate";

            return returnResponse(true, 'SENTENCES.LOGIN_SUCCESS', $success);
        } else {
            return returnResponse(false, 'SENTENCES.UNAUTHORIZED', [], 403);
        }
    }

    /**
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function adminLogout(Request $request)
    {
        $user = $request->user();
        foreach ($user->tokens as $token) {
            $token->revoke();
        }
        Auth::guard('admin')->logout();
        //        DB::delete('delete from sessions where user_id = ?',[$user->id]);

        return returnResponse(true, "SENTENCES.LOGOUT_SUCCESS");
    }

    public function subscriberLogout(Request $request)
    {
        $user = $request->user();
        foreach ($user->tokens as $token) {
            $token->revoke();
        }
        Auth::guard('subscriber')->logout();
        return returnResponse(true, "SENTENCES.LOGOUT_SUCCESS");
    }

    public function affiliateLogout(Request $request)
    {
        $user = $request->user();
        foreach ($user->tokens as $token) {
            $token->revoke();
        }
        Auth::guard('admin')->logout();
        //        DB::delete('delete from sessions where user_id = ?',[$user->id]);

        return returnResponse(true, "SENTENCES.LOGOUT_SUCCESS");
    }


    /**
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function adminSuperLogout(Request $request)
    {
        $user = $request->user();
        foreach ($user->tokens as $token) {
            $token->revoke();
        }
        Auth::guard('super')->logout();
        //        DB::delete('delete from sessions where user_id = ?',[$user->id]);

        return returnResponse(true, "SENTENCES.LOGOUT_SUCCESS");
    }

    protected function getTokenAndRefreshToken($email, $password)
    {
        $oClient = OClient::where('password_client', 1)->first();
        $http = new Client;
        $response = $http->request('POST', url('/') . '/oauth/token', [
            'form_params' => [
                'grant_type' => 'password',
                'client_id' => $oClient->id,
                'client_secret' => $oClient->secret,
                'username' => $email,
                'password' => $password,
                'scope' => '*',
            ],
        ]);

        $result = json_decode((string) $response->getBody(), true);
        //        return $result;
        return response()->json($result, 200);
    }

    /**
     * @param Request $request
     * @return $this|\Illuminate\Http\RedirectResponse|\Illuminate\Routing\Redirector
     */
    public function profileUpdate(Request $request)
    {

        $input = $request->all();
        $file = $request->file();
        $filePath = '';

        $messages = [
            'name.required' => 'VALIDATION_MSGS.NAME.REQUIRED',
            'last_name.required' => 'VALIDATION_MSGS.LAST_NAME.REQUIRED'
        ];

        $validatorArray = [
            'name' => 'required|string|max:50',
            'last_name' => 'required|string|max:50',
        ];
        if (isset($input['email']) && Auth::user()->email != $input['email']) {
            $validatorArray['email'] = 'required|email|unique:users';
            $updateArray['email'] = $input['email'];

            $messages['email.required'] = 'VALIDATION_MSGS.EMAIL.REQUIRED';
            $messages['email.email'] = 'VALIDATION_MSGS.EMAIL.VALID';
            $messages['email.unique'] = 'VALIDATION_MSGS.EMAIL.UNIQUE';
        }
        if (isset($input['password'])) {
            $validatorArray['password'] = 'string|max:50';
            $messages['password.required'] = 'VALIDATION_MSGS.PASSWORD.REQUIRED';
        }
        if (isset($input['file_upload'])) {
            $validatorArray['file_upload'] = 'mimes:png,jpeg,jpg|max:5120';
            $messages['password.required'] = 'VALIDATION_MSGS.IMAGE.REQUIRED';
        }

        $validator = Validator::make($input, $validatorArray, $messages);
        if ($validator->fails()) {
            return returnResponse(true, $validator->errors());
            //            return redirect()->back()->withInput()->withErrors($validator);
        }
        if ($file) {
            $fileName = time() . '____' . $request->file('profile_pic')->getClientOriginalName();
            $fileName = str_replace(' ', '_', $fileName);
            $path = '/uploads/user_profile';
            $request->file('profile_pic')->storeAs($path, $fileName);
            $updateArray['profile_pic'] = '/storage/app' . $path . '/' . $fileName;
        }
        $updateArray['first_name'] = $input['first_name'];
        $updateArray['last_name'] = $input['last_name'];
        if (isset($input['password'])) {
            $updateArray['password'] = Hash::make($input['password']);
        }
        $affected = DB::table('users')
            ->where('id', request()->user()->id)
            ->update($updateArray);
        if ($affected) {
            return returnResponse(true, 'User updated successfully.', User::find(request()->user()->id));
        } else {
            return returnResponse(false, 'Nothing Updated"');
        }
    }

    public function subscriberAdminForgotPassword(Request $request)
    {
        $admin = SubscriberAdmin::where('email', $request->email)->first();
        if ($admin) {
            $admin->reset_password_token = Str::uuid();
            $admin->reset_password_sent_at = Carbon::now()->toDateTimeString();
            $admin->save();
            try {
                $data = array(
                    'first_name' => $admin->first_name,
                    'last_name' => $admin->last_name,
                    'reset_password_token' => $admin->reset_password_token,
                    'email' => $admin->email
                );
                SubscriberAdminResetPasswordMail::dispatch((object)$data);
            } catch (\Exception $e) {
            }
            return returnResponse(true, 'mail sent successfully.', [], 200, true);
        }
        return returnResponse(false, 'mail not exist.', [], 403, true);
    }

    public function subscriberAdminCheckResetPasswordToken($token)
    {
        $member = SubscriberAdmin::where('reset_password_token', $token)->first();
        if ($member) {
            $reset_time = $member->reset_password_sent_at;
            $now = Carbon::now()->toDateTimeString();
            $reset_time = Carbon::parse($reset_time);
            $diff = $reset_time->diffInMinutes($now);
            if ($diff > 10)
                return returnResponse(false, 'token expired.', [], 403, true);
            else
            return returnResponse(true, 'token verified.', $member->email, 200, true);
        } else
        return returnResponse(false, 'Invalid Credentials', [], 403, true);
    }

    public function subscriberAdminResetPassword(Request $request)
    {
        $messages = array(
            'password.required' => 'VALIDATION_MSGS.LAST_NAME.REQUIRED',
            'email.required' => 'VALIDATION_MSGS.EMAIL.REQUIRED'
        );

        $validator = Validator::make($request->all(), [
            'password' => 'required',
            'email' => 'required'
        ], $messages);

        if($validator->fails()) {
            return returnResponse(false, '', $validator->errors(), Response::HTTP_BAD_REQUEST);
        }

        $admin = SubscriberAdmin::where('email',$request->email)->first();

        if(empty($admin)) {
            return returnResponse(true, 'SENTENCES.NOT_FOUND',[ ], 404, true);
        }
        
        DB::beginTransaction();

            $insertData = [
                'reset_password_token'=>NULL,
                'reset_password_sent_at'=>NULL,
            ];

            if(!empty($request->encrypted_password)) {
                $newpassword = base64_decode($request->encrypted_password);
                $insertData['password']=bcrypt($newpassword);
            }

            $admin->update($insertData);
            if(!empty($request->encrypted_password)) {
                $admin->newpassword = $newpassword;
                try {
                    $data = array(
                        'first_name' => $admin->first_name,
                        'last_name'=>$admin->last_name,
                        'newpassword'=>$newpassword,
                        'email'=>$admin->email
                    );
                    // (new MailController)->subscriberAdminChangePassword($admin);
                    SubscriberAdminChangePasswordMail::dispatch((object)$data);
                } catch (\Exception $e) { }
            }

        DB::commit();

        return returnResponse(true, 'SENTENCES.UPDATED_SUCCESS', [], Response::HTTP_OK, true);
    }
}
