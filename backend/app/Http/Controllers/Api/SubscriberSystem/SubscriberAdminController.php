<?php

namespace App\Http\Controllers\Api\SubscriberSystem;

# Controller
use App\Http\Controllers\Api\MailController;

// Libraries
use App\Http\Controllers\Controller;
use App\Jobs\NewSubscriberAdminMail;
use App\Jobs\SubscriberAdminChangePasswordMail;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Auth;
use Validator;
use Carbon\Carbon;

// Models
use App\Models\SubscriberSystem\SubscriberAdmin;
use App\Models\SubscriberSystem\SubscriberAdminUsersAdminRoles;
use App\Models\SubscriberSystem\SubscriberAdminUserPermission;
use App\Models\SubscriberSystem\SubscriberAdminRole;
use Illuminate\Support\Facades\Crypt;
use Illuminate\Support\Facades\Hash;

class SubscriberAdminController extends Controller
{

    public function index(Request $request) {
        $query = new SubscriberAdmin;

        if(!empty($request->search)) {
            $query = $query->where('first_name', 'ILIKE', '%'.$request->search.'%')
                ->orWhere('last_name', 'ILIKE', '%'.$request->search.'%');
        }

        if(!empty($request->subscriber_id)) {
            $query = $query->where('subscriber_id', $request->subscriber_id);
        }

        $record = $query->select(['id', 'first_name', 'last_name', 'email', 'agent_name', 'phone', 'phone_verified', 'active'])
        ->paginate($request->size ?? 10);

        return returnResponse(true, "Record get Successfully", $record);
    }

    public function store(Request $request) {

        $messages = array(
            'first_name.required' => 'VALIDATION_MSGS.FIRST_NAME.REQUIRED',
            'last_name.required' => 'VALIDATION_MSGS.LAST_NAME.REQUIRED',
            'agent_name.required' => 'VALIDATION_MSGS.ADMIN_CODE.REQUIRED',
            'phone.required' => 'VALIDATION_MSGS.PHONE_NUMBER.REQUIRED',
            'email.required' => 'VALIDATION_MSGS.EMAIL.REQUIRED',
            'encrypted_password.required' => 'VALIDATION_MSGS.PASSWORD.REQUIRED',
        );

        $validator = Validator::make($request->all(), [
            'first_name' => 'required',
            'last_name' => 'required',
            'agent_name' => 'required',
            'phone' => 'required',
            'email' => 'required',
            'encrypted_password' => 'required'
        ], $messages);

        if($validator->fails()) {
            return returnResponse(false, '', $validator->errors(), Response::HTTP_BAD_REQUEST);
        }

        if(SubscriberAdmin::where('email', $request->email)->exists()) {
            return returnResponse(true, 'SENTENCES.EMAIL_EXIST', [ ], 403, true);
        }

        if(SubscriberAdmin::where('agent_name', $request->agent_name)->exists()) {
            return returnResponse(true, 'SENTENCES.CODE_EXIST', [ ], 403, true);
        }

        $newpassword = base64_decode($request->encrypted_password);

        DB::beginTransaction();

            $insertData = [
                'subscriber_id' => $request->subscriber_id,
                'first_name'=>$request->first_name,
                'last_name'=>$request->last_name,
                'email'=>$request->email,
                'password'=>bcrypt($newpassword),
                'phone'=>$request->phone,
                'parent_id' => Auth::User()->id,
                'parent_type' => SUPER_ADMIN_TYPE,
                'agent_name' => $request->agent_name,
                'active' => true
            ];

             $admin = SubscriberAdmin::create($insertData);

            if(!empty($admin)) {

                SubscriberAdminUsersAdminRoles::create([
                    'admin_user_id' => $admin->id,
                    'admin_role_id' => SubscriberAdminRole::select(['id'])->where('abbr', 'admin')->first()->id
                ]);

                if(PERMISSIONS['subscriber']['admin'] && count(PERMISSIONS['tenant']['admin']) > 0) {
                    $permissions = array();
                    $index = 0;
                    foreach(PERMISSIONS['subscriber']['admin'] as $key => $value) {
                        $permissions[$index]['admin_user_id'] = $admin->id;
                        $permissions[$index]['action'] = $key;
                        $permissions[$index]['permission'] = json_encode($value);
                        $permissions[$index]['created_at'] = Carbon::now()->toDateTimeString();
                        $permissions[$index]['updated_at'] = Carbon::now()->toDateTimeString();
                        $index++;
                    }
                    SubscriberAdminUserPermission::insert($permissions);
                }

                $admin->newpassword = $newpassword;
                try {
                    $data = array(
                        'first_name' => $admin->first_name,
                        'last_name'=>$admin->last_name,
                        'newpassword'=>$newpassword,
                        'email'=>$admin->email
                    );
                    // (new MailController)->newSubscriberAdmin($admin);
                    NewSubscriberAdminMail::dispatch((object)$data);
                } catch (\Exception $e) { }

            }

        DB::commit();

        return returnResponse(true, 'SENTENCES.CREATED_SUCCESS', [], Response::HTTP_OK, true);
    }

    public function show($id) {
        $admin = SubscriberAdmin::select(['id', 'first_name', 'last_name', 'email', 'agent_name', 'phone', 'active'])->find($id);
        return returnResponse(true, "Record get Successfully", $admin);
    }

    public function update(Request $request) {

        $messages = array(
            'id.required' => 'VALIDATION_MSGS.ID.REQUIRED',
            'first_name.required' => 'VALIDATION_MSGS.FIRST_NAME.REQUIRED',
            'last_name.required' => 'VALIDATION_MSGS.LAST_NAME.REQUIRED',
            'agent_name.required' => 'VALIDATION_MSGS.ADMIN_CODE.REQUIRED',
            'phone.required' => 'VALIDATION_MSGS.PHONE_NUMBER.REQUIRED',
            'email.required' => 'VALIDATION_MSGS.EMAIL.REQUIRED'
        );

        $validator = Validator::make($request->all(), [
            'id' => 'required',
            'first_name' => 'required',
            'last_name' => 'required',
            'agent_name' => 'required',
            'phone' => 'required',
            'email' => 'required'
        ], $messages);

        if($validator->fails()) {
            return returnResponse(false, '', $validator->errors(), Response::HTTP_BAD_REQUEST);
        }

        $admin = SubscriberAdmin::find($request->id);

        if(empty($admin)) {
            return returnResponse(true, 'SENTENCES.NOT_FOUND',[ ], 404, true);
        }

        if(SubscriberAdmin::where('email', $request->email)->whereNotIn('id', [ $admin->id ])->exists()) {
            return returnResponse(true, 'SENTENCES.EMAIL_EXIST',[ ], 403, true);
        }

        if(SubscriberAdmin::where('agent_name', $request->agent_name)->whereNotIn('id', [ $admin->id ])->exists()) {
            return returnResponse(true, 'SENTENCES.CODE_EXIST',[ ], 403, true);
        }

        DB::beginTransaction();

            $insertData = [
                'first_name'=>$request->first_name,
                'last_name'=>$request->last_name,
                'email'=>$request->email,
                'phone'=>$request->phone,
                'agent_name' => $request->agent_name,
                'active' => $request->active == 'true' ? true : false
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

    public function updatePassword(Request $request) {

        $messages = array(
            'id.required' => 'VALIDATION_MSGS.ID.REQUIRED',
            'old_password.required' => 'VALIDATION_MSGS.FIRST_NAME.REQUIRED',
            'password.required' => 'VALIDATION_MSGS.LAST_NAME.REQUIRED',
            'email.required' => 'VALIDATION_MSGS.EMAIL.REQUIRED'
        );

        $validator = Validator::make($request->all(), [
            'id' => 'required',
            'old_password' => 'required',
            'password' => 'required',
            'email' => 'required'
        ], $messages);

        if($validator->fails()) {
            return returnResponse(false, '', $validator->errors(), Response::HTTP_BAD_REQUEST);
        }

        $admin = SubscriberAdmin::find($request->id);

        if(empty($admin)) {
            return returnResponse(true, 'SENTENCES.NOT_FOUND',[ ], 404, true);
        }

        if (!Hash::check($request->old_password, $admin->password)) {
            return returnResponse(true, 'Old Password does not match',[ ], 403, true);
        }
        
        DB::beginTransaction();

            $insertData = [];

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
