<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;

# Controller
use App\Http\Controllers\Api\MailController;

# Models
use App\Models\Admin;
use App\Models\Super;
use App\Models\Transactions;
use App\Models\Admin as AdminModel;
use App\Models\Wallets;
use App\Models\Currencies;
use App\Models\AdminRole;
use App\Models\AdminUserPermission;
use App\Models\SuperAdminUserPermission;
use App\Models\SuperRole;
use App\Models\AdminUsersAdminRoles;
use App\Models\SuperAdminUserSuperRole;
use App\Models\AdminUserSetting;
use App\Models\TenantConfigurations;
use App\Models\Tenants;
use App\Models\SubscriberSystem\SubscriberAdmin;

# Helpers and Libraries
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Validator;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Crypt;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\App;
use App\Aws3;
use App\Jobs\AdminChangePasswordMail;
use App\Jobs\NewAdminMail;
use App\Jobs\NewAdminParentMail;
use App\Models\CrashGame\Bets;
use App\Models\OnlineGameSystem\FreeBets;
use App\Models\SubscriberSystem\Subscriber;
use App\Models\SubscriberSystem\User as SubscriberSystemUser;
use Carbon\Carbon;
use DateTime;
use Illuminate\Support\Facades\Date;
use Illuminate\Support\Facades\Redis;

class AdminController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index(Request $request)
    {
        $page = $request->has('page') ? $request->post('page') : 1;
        $limit = $request->has('size') ? $request->post('size') : 10;
        $filter['email'] = $request->has('email') ? $request->post('email') : '';
        $filter['first_name'] = $request->has('first_name') ? $request->post('first_name') : '';
        $filter['last_name'] = $request->has('last_name') ? $request->post('last_name') : '';
        $filter['phone'] = $request->has('phone') ? $request->post('phone') : '';
        $filter['active'] = $request->has('active') ? $request->post('active') : '';
        $filter['agent_name'] = $request->has('agent_name') ? $request->post('agent_name') : '';
        $filter['tenant_id'] = $request->has('tenant_id') ? $request->post('tenant_id') : '';
        $filter['parent_id'] = $request->has('parent_id') ? $request->post('parent_id') : '';

        if ($filter['tenant_id']) {
            $record = AdminModel::getList($limit, $page, $filter);
        } else {
            $record = Super::getList($limit, $page, $filter);
        }

        return returnResponse(true, "Record get Successfully", $record);
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        $messages = array();

        if ($request->admin_type === 'tenant') {

            $messages = array(
                'first_name.required' => 'VALIDATION_MSGS.FIRST_NAME.REQUIRED',
                'last_name.required' => 'VALIDATION_MSGS.LAST_NAME.REQUIRED',
                'email.required' => 'VALIDATION_MSGS.EMAIL.REQUIRED',
                'encrypted_password.required' => 'VALIDATION_MSGS.PASSWORD.REQUIRED',
                'role.required' => 'VALIDATION_MSGS.ROLE.REQUIRED',
                'agent_name.required' => 'VALIDATION_MSGS.ADMIN_CODE.REQUIRED',
                'phone.required' => 'VALIDATION_MSGS.PHONE_NUMBER.REQUIRED',
                'phone_verified.required' => 'VALIDATION_MSGS.PHONE_VERIFIED.REQUIRED',
                'currency_code' => 'VALIDATION_MSGS.CURRENCY.REQUIRED',
                'tenant_id.required' => 'VALIDATION_MSGS.TENANT_ID.REQUIRED',
                'permissions' => 'VALIDATION_MSGS.PERMISSION.REQUIRED'
            );
        } else {

            $messages = array(
                'first_name.required' => 'VALIDATION_MSGS.FIRST_NAME.REQUIRED',
                'last_name.required' => 'VALIDATION_MSGS.LAST_NAME.REQUIRED',
                'email.required' => 'VALIDATION_MSGS.EMAIL.REQUIRED',
                'encrypted_password.required' => 'VALIDATION_MSGS.PASSWORD.REQUIRED',
                'role.required' => 'VALIDATION_MSGS.ROLE.REQUIRED',
                'agent_name.required' => 'VALIDATION_MSGS.ADMIN_CODE.REQUIRED',
                'phone.required' => 'VALIDATION_MSGS.PHONE_NUMBER.REQUIRED',
                'permissions' => 'VALIDATION_MSGS.PERMISSION.REQUIRED'
            );
        }

        $validations = $this->validations($request->admin_type, 'store');

        $validator = Validator::make($request->all(), $validations, $messages);

        if ($validator->fails()) {
            return returnResponse(false, '', $validator->errors(), Response::HTTP_BAD_REQUEST);
        }

        DB::beginTransaction();

        $adminch = ($request->admin_type === 'tenant') ? new AdminModel : new Super;

        if ($adminch->where('email', $request->email)->exists()) {
            return returnResponse(true, 'SENTENCES.EMAIL_EXIST', [], 403, true);
        }

        if ($adminch->where('agent_name', $request->agent_name)->exists()) {
            return returnResponse(true, 'SENTENCES.CODE_EXIST', [], 403, true);
        }

        $role = Auth::user()->role->first();

        $newpassword = base64_decode($request->encrypted_password);

        $insertData = [
            'first_name' => $request->first_name,
            'last_name' => $request->last_name,
            'email' => $request->email,
            'encrypted_password' => bcrypt(base64_decode($request->encrypted_password)),
            'phone' => $request->phone,
            'parent_id' => Auth::user()->id,
            'parent_type' => ($request->admin_type === 'super') ? SUPER_ADMIN_TYPE : ADMIN_TYPE,
            'agent_name' => $request->agent_name,
            'active' => true
        ];

        $parentId = '';

        if ($request->admin_type === 'tenant') {
            $insertData['tenant_id'] = $request->tenant_id;
            $insertData['phone_verified'] = $request->phone_verified;

            if (!empty($request->master_agent_id)) {
                $parentId = $request->master_agent_id;
            } else if (!empty($request->senior_master_id)) {
                $parentId = $request->senior_master_id;
            } else if (!empty($request->super_senior_id)) {
                $parentId = $request->super_senior_id;
            }
        } else if ($request->admin_type === 'super') {
            if (!empty($request->super_admin_id)) {
                $parentId = $request->super_admin_id;
            }
        }

        if (!empty($parentId)) {
            $insertData['parent_id'] = $parentId;
        }

        $admin = ($request->admin_type === 'tenant') ? AdminModel::create($insertData) : Super::create($insertData);

        if ($admin) {

            $permissions = json_decode($request->permissions);

            $permissionArray = [];

            foreach ($permissions as $header => $permission) {
                $p = [
                    "action" => $header,
                    "permission" => json_encode($permission),
                ];

                if ($request->admin_type === 'tenant') {
                    $p["admin_user_id"] = $admin->id;
                } else {
                    $p["super_admin_user_id"] = $admin->id;
                }

                $permissionArray[] = $p;
            }

            if ($request->admin_type === 'tenant') {

                AdminUserPermission::insert($permissionArray);

                AdminUsersAdminRoles::create([
                    'admin_user_id' => $admin->id,
                    'admin_role_id' => $request->role
                ]);

                // Agent default full user management permissions
                if ($admin->role[0]->abbr === 'agent') {

                    if ($agentUsersPermission = AdminUserPermission::where('admin_user_id', $admin->id)
                        ->where('action', 'users')
                        ->first()
                    ) {
                        $agentUsersPermission->permission = json_encode(["C", "R", "U", "D"]);
                        $agentUsersPermission->save();
                    } else {
                        $agentUsersPermission = new AdminUserPermission;
                        $agentUsersPermission->admin_user_id = $admin->id;
                        $agentUsersPermission->action = 'users';
                        $agentUsersPermission->permission = json_encode(["C", "R", "U", "D"]);
                        $agentUsersPermission->save();
                    }
                }
            } else {
                SuperAdminUserPermission::insert($permissionArray);

                SuperAdminUserSuperRole::create([
                    'super_admin_user_id' => $admin->id,
                    'super_role_id' => $request->role
                ]);
                $currencies = Currencies::select(['code'])->get();

                $WalletInsertArr = [];
                foreach ($currencies as $currencyKey => $value) {
                    $insertWallets['owner_id'] = $admin->id;
                    $insertWallets['currency_code'] = $value->code;
                    $insertWallets['owner_type'] = SUPER_ADMIN_TYPE;
                    $insertWallets['created_at'] = Date::now();
                    $insertWallets['updated_at'] = Date::now();
                    array_push($WalletInsertArr, $insertWallets);
                }
                Wallets::insert($WalletInsertArr);
            }


            if ($request->currency_code) {

                $primaryCurrency = Currencies::select(['code'])->where('primary', true)->first();
                $tenantPrimaryCurrency = Tenants::select(['primary_currency'])->find($request->tenant_id);
                $adminCurrencies = array_unique(array_merge($request->currency_code, [$primaryCurrency->code, $tenantPrimaryCurrency->primary_currency]));

                foreach ($adminCurrencies as $currencyKey => $value) {
                    $insertWallets['owner_id'] = $admin->id;
                    $insertWallets['currency_code'] = $value;
                    $insertWallets['owner_type'] = ADMIN_TYPE;
                    Wallets::create($insertWallets);
                }
            }
        }

        $admin->newpassword = $newpassword;

        try {
            // (new MailController)->newAdmin($admin);
            $data = array(
                'first_name' => $admin->first_name,
                'last_name' => $admin->last_name,
                'newpassword' => $newpassword,
                'email' => $admin->email
            );
            NewAdminMail::dispatch((object)$data);
        } catch (\Exception $e) {
        }

        if (!empty($parentId)) {
            $adminChEmail = ($request->admin_type === 'tenant') ? new AdminModel : new Super;
            $parentAdmin = $adminChEmail->select(['email', 'first_name', 'last_name'])->find($parentId);

            $parentData = [
                'email' => $parentAdmin->email,
                'username' => $parentAdmin->first_name . ' ' . $parentAdmin->last_name,
                'downusername' => $admin->first_name . ' ' . $admin->last_name,
                'role' => $admin->role->first()->name
            ];

            try {
                NewAdminParentMail::dispatch($parentData);
                // (new MailController)->newAdminParent($parentData);
            } catch (\Exception $e) {
            }
        }

        DB::commit();

        return returnResponse(true, 'SENTENCES.CREATED_SUCCESS', AdminModel::find($admin->id), Response::HTTP_OK, true);
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show(Request $request, $id)
    {
        $wallets = [];
        $admin = ($request->type === 'tenant') ? new Admin : new Super;
        $admin = $admin->with(['role', 'parent'])->where('id', $id)->first();

        if ($request->type === 'tenant') {

            if ($admin) {
                $admin->tenant = Tenants::where('id', $admin->tenant_id)->first();

                $admin->wallets = Wallets::with(['currency'])
                    ->where('owner_id', $id)
                    ->where('owner_type', ADMIN_TYPE)
                    ->get();

                foreach ($admin->wallets as &$wallet) {

                    $transaction = Transactions::where('transaction_type', TRANSACTION_TYPE_DEPOSIT)
                        ->where('target_wallet_id', $wallet->id)
                        ->orderBy('created_at', 'DESC')
                        ->first();

                    $lastUpdated = Transactions::where('target_wallet_id', $wallet->id)
                        ->orderBy('updated_at', 'DESC')
                        ->first();

                    $wallet->last_deposited_amount = ($transaction) ? $transaction->amount : 0;
                    $wallet->last_updated_at = ($lastUpdated) ? $lastUpdated->updated_at : '';
                }
            }

            $wallets = Wallets::with(['currency'])
                ->where('owner_id', Auth::user()->id)
                ->where('owner_type', ADMIN_TYPE)
                ->get();
        }

        return returnResponse(true, "Record get Successfully", ["admin" => $admin, "wallets" => $wallets], Response::HTTP_OK, true);
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function update($id, Request $request)
    {
        $admin = ($request->admin_type === 'tenant') ? AdminModel::find($id) : Super::find($id);

        if (!$admin) {
            return returnResponse(false, 'SENTENCES.NOT_FOUND', [], 404);
        }

        $messages = array();

        if ($request->admin_type === 'tenant') {

            $messages = array(
                'first_name.required' => 'VALIDATION_MSGS.FIRST_NAME.REQUIRED',
                'last_name.required' => 'VALIDATION_MSGS.LAST_NAME.REQUIRED',
                'email.required' => 'VALIDATION_MSGS.EMAIL.REQUIRED',
                'role.required' => 'VALIDATION_MSGS.ROLE.REQUIRED',
                'agent_name.required' => 'VALIDATION_MSGS.ADMIN_CODE.REQUIRED',
                'phone.required' => 'VALIDATION_MSGS.PHONE_NUMBER.REQUIRED',
                'phone_verified.required' => 'VALIDATION_MSGS.PHONE_VERIFIED.REQUIRED',
                'currency_code' => 'VALIDATION_MSGS.CURRENCY.REQUIRED',
                'permissions' => 'VALIDATION_MSGS.PERMISSION.REQUIRED'
            );
        } else {

            $messages = array(
                'first_name.required' => 'VALIDATION_MSGS.FIRST_NAME.REQUIRED',
                'last_name.required' => 'VALIDATION_MSGS.LAST_NAME.REQUIRED',
                'email.required' => 'VALIDATION_MSGS.EMAIL.REQUIRED',
                'role.required' => 'VALIDATION_MSGS.ROLE.REQUIRED',
                'agent_name.required' => 'VALIDATION_MSGS.ADMIN_CODE.REQUIRED',
                'phone.required' => 'VALIDATION_MSGS.PHONE_NUMBER.REQUIRED',
                'permissions' => 'VALIDATION_MSGS.PERMISSION.REQUIRED'
            );
        }

        $validations = $this->validations($request->admin_type, 'update');

        $validator = Validator::make($request->all(), $validations, $messages);

        if ($validator->fails()) {
            return returnResponse(false, '', $validator->errors(), 400);
        }

        $adminch = ($request->admin_type === 'tenant') ? new AdminModel : new Super;

        if ($adminch->where('email', $request->email)->whereNotIn('id', [$admin->id])->exists()) {
            return returnResponse(true, 'SENTENCES.EMAIL_EXIST', [], 403, true);
        }

        if ($adminch->where('agent_name', $request->agent_name)->whereNotIn('id', [$admin->id])->exists()) {
            return returnResponse(true, 'SENTENCES.CODE_EXIST', [], 403, true);
        }

        $oldRole = $admin->role->first()->id;

        DB::beginTransaction();
        try {
            $insertData = [
                'first_name' => $request->first_name,
                'last_name' => $request->last_name,
                'email' => $request->email,
                'phone' => $request->phone,
                'phone_verified' => $request->phone_verified,
                'agent_name' => $request->agent_name,
                'active' => true
            ];

            if (@$request->encrypted_password && @$request->encrypted_password != '') {
                $newpassword = base64_decode($request->encrypted_password);
                $insertData['encrypted_password'] = bcrypt(base64_decode($request->encrypted_password));
            }

            $admin->update($insertData);

            $role = $admin->role->first();

            if ($request->admin_type === 'tenant') {
                AdminUsersAdminRoles::where('admin_user_id', $id)
                    ->update([
                        'admin_role_id' => $request->role,
                    ]);
            } else {
                SuperAdminUserSuperRole::where('super_admin_user_id', $id)
                    ->update([
                        'super_role_id' => $request->role,
                    ]);
            }

            if ($request->currency_code) {

                $primaryCurrency = Currencies::select(['code'])->where('primary', true)->first();
                $tenantPrimaryCurrency = Tenants::select(['primary_currency'])->find($request->tenant_id);
                $adminCurrencies = array_unique(array_merge($request->currency_code, [$primaryCurrency->code, $tenantPrimaryCurrency->primary_currency]));

                foreach ($adminCurrencies as $currencyKey => $value) {
                    $currencies = Currencies::where('code', $value)->first();
                    $wallets = Wallets::where(['owner_id' => $id, 'owner_type' => ADMIN_TYPE, 'currency_code' => $currencies->code])->first();
                    if (!$wallets) {
                        $insertWallets['owner_id'] = $id;
                        $insertWallets['currency_code'] = $currencies->code;
                        $insertWallets['owner_type'] = ADMIN_TYPE;
                        Wallets::create($insertWallets);
                    }
                }
            }

            $permissions = json_decode($request->permissions);

            // Update permissions
            foreach ($permissions as $header => $p) {

                // Update permissions if header exists or create a new header and permissions
                $permission = ($request->admin_type === 'tenant') ? AdminUserPermission::where('admin_user_id', $id)
                    ->where('action', $header)
                    ->first() : SuperAdminUserPermission::where('super_admin_user_id', $id)
                    ->where('action', $header)
                    ->first();
                if ($permission) {
                    $permission->permission = json_encode($p);
                    $permission->update();
                } else {
                    if ($request->admin_type === 'tenant') {
                        AdminUserPermission::create([
                            "admin_user_id" => $id,
                            "action" => $header,
                            "permission" => json_encode($p)
                        ]);
                    } else {
                        SuperAdminUserPermission::create([
                            "super_admin_user_id" => $id,
                            "action" => $header,
                            "permission" => json_encode($p)
                        ]);
                    }
                }
            }

            // Agent default full user management permissions
            if ($request->admin_type === 'tenant' && $admin->role[0]->abbr === 'agent') {

                if ($agentUsersPermission = AdminUserPermission::where('admin_user_id', $admin->id)
                    ->where('action', 'users')
                    ->first()
                ) {
                    $agentUsersPermission->permission = json_encode(["C", "R", "U", "D"]);
                    $agentUsersPermission->save();
                } else {
                    $agentUsersPermission = new AdminUserPermission;
                    $agentUsersPermission->admin_user_id = $admin->id;
                    $agentUsersPermission->action = 'users';
                    $agentUsersPermission->permission = json_encode(["C", "R", "U", "D"]);
                    $agentUsersPermission->save();
                }
            }

            if (!empty($request->encrypted_password)) {
                $admin->newpassword = $newpassword;
                try {
                    $data = array(
                        'first_name' => $admin->first_name,
                        'last_name' => $admin->last_name,
                        'newpassword' => $newpassword,
                        'email' => $admin->email
                    );
                    AdminChangePasswordMail::dispatch((object) $data);
                    // (new MailController)->adminChangePassword($admin);
                } catch (\Exception $e) {
                }
            }

            DB::commit();

            return returnResponse(true, 'SENTENCES.UPDATED_SUCCESS', $admin, Response::HTTP_OK, true);
        } catch (\Exception $e) {
            DB::rollback();
            // something went wrong
            return returnResponse(false, $e->getMessage(), [], Response::HTTP_EXPECTATION_FAILED, true);
        }
    }

    public function updateUserStatus(Request $request)
    {
        try {
            $player = SubscriberSystemUser::find($request->id);

            if (empty($player)) {
                return returnResponse(false, 'SENTENCES.NOT_FOUND', [], Response::HTTP_NOT_FOUND, true);
            }

            SubscriberSystemUser::where('id', $request->id)->update(['status' => $request->status]);

            return returnResponse(true, 'SENTENCES.STATUS_CHANGE', [], Response::HTTP_OK, true);
        } catch (\Exception $e) {
            return returnResponse(false, $e->getMessage(), [], Response::HTTP_EXPECTATION_FAILED, true);
        }
    }

    private function validations($adminType, $for)
    {

        if ($for === 'store') {
            if ($adminType === 'tenant') {
                $validations = [
                    'first_name' => 'required|alpha_num',
                    'last_name' => 'required|alpha_num',
                    'email' => 'required|email|unique:App\Models\Admin',
                    'encrypted_password' => 'required',
                    'role' => 'required',
                    'agent_name' => 'required|alpha_dash',
                    'phone' => 'required',
                    'phone_verified' => 'required',
                    'currency_code' => 'required',
                    'tenant_id' => 'required',
                    'permissions' => 'required',
                ];
            } else {
                $validations = [
                    'first_name' => 'required|alpha_num',
                    'last_name' => 'required|alpha_num',
                    'email' => 'required|email|unique:App\Models\Super',
                    'encrypted_password' => 'required',
                    'role' => 'required',
                    'agent_name' => 'required|alpha_dash',
                    'phone' => 'required',
                    'permissions' => 'required',
                ];
            }
        } else {
            if ($adminType === 'tenant') {
                $validations = [
                    'first_name' => 'required',
                    'last_name' => 'required',
                    'email' => 'required|email',
                    'role' => 'required',
                    'agent_name' => 'required',
                    'phone' => 'required',
                    'phone_verified' => 'required',
                    'currency_code' => 'required',
                    'permissions' => 'required',
                ];
            } else {
                $validations = [
                    'first_name' => 'required',
                    'last_name' => 'required',
                    'email' => 'required|email',
                    'role' => 'required',
                    'agent_name' => 'required',
                    'phone' => 'required',
                    'permissions' => 'required',
                ];
            }
        }

        return $validations;
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        $admin = AdminModel::where('id', $id)->where('active', true)->get();
        $adminArray = $admin->toArray();
        if (!count($adminArray)) {
            return returnResponse(false, 'SENTENCES.NOT_FOUND', [], 404, true);
        } else {
            $record = Admin::getListOfUser($id);
            AdminModel::where(['id' => $id])->update(['active' => false, 'deactivated_by_id' => auth()->id(), 'deactivated_at' => date('Y-m-d h:i:s'), 'deactivated_by_type' => auth()->user()->parent_type]);

            return returnResponse(true, 'SENTENCES.STATUS_CHANGE', $record, Response::HTTP_OK, true);
        }
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function activeUsers($id)
    {
        $admin = AdminModel::where('id', $id)->where('active', false)->get();
        $adminArray = $admin->toArray();
        if (!count($adminArray)) {
            return returnResponse(false, 'SENTENCES.NOT_FOUND', [], 404, true);
        } else {
            $record = Admin::getListOfUser($id);
            AdminModel::where(['id' => $id])->update(['active' => true, 'deactivated_by_id' => auth()->id(), 'deactivated_at' => date('Y-m-d h:i:s'), 'deactivated_by_type' => auth()->user()->parent_type]);

            return returnResponse(true, 'SENTENCES.STATUS_CHANGE', $record, Response::HTTP_OK, true);
        }
    }

    public function getPlayerStatus($sub_id, $user_id)
    {
        $now = Carbon::now()->toDateTimeString();
        $freebet = FreeBets::where('user_id', $user_id)
            ->where('end_date', '>=', Carbon::now()->toDateTimeString())
            ->get();
        $freebet = $freebet->toArray();
        if (!count($freebet))
            $freebet = 0;
        else
            $freebet = 1;
        $query = Bets::select('created_at')->where('user_id', $user_id)->orderby('created_at', 'DESC')->limit(1)->first();
        $lastBetDate = $query->created_at;
        $lastBetDate = Carbon::parse($lastBetDate)->toDateTimeString();
        $redis = Redis::connection();
        $token = Redis::get('PLAYER-TOKEN:OperatorId-' . $sub_id . '.UserId:' . $user_id);
        if ($token) {
            $token = json_decode($token);
            $token = $token->lastActiveAt;
            $dt = date("Y-m-d H:i:s", substr($token, 0, 10));
            $now = Carbon::now()->toDateTimeString();
            $datework = Carbon::parse($dt);
            $diff = $datework->diffInMinutes($now);
            if ($diff < 10)
                $record = 1;
            else
                $record = 0;
        } else
            $record = 0;
        $data = [
            'status' => $record,
            'lastDate' => $lastBetDate,
            'freebet' => $freebet
        ];
        return returnResponse(true, MESSAGE_GET_SUCCESS, $data, Response::HTTP_OK, true);
    }

    /**
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function getAdminAgents(Request $request)
    {

        if ($request->type === 'super') {
            $admins = new Super;
        } else if ($request->type === 'subscriber') {
            $admins = SubscriberAdmin::where('subscriber_id', $request->subscriber_id);
        } else {
            $admins = Admin::where('tenant_id', $request->tenant_id);
        }

        $admins = $admins->with(['role'])->where('id', '!=', $request->adminId);

        if ($request->type !== 'subscriber') {
            $admins = $admins->where('parent_id', $request->adminId);
        }

        if ($request->search) {
            $admins = $admins->where(function ($w) use ($request) {
                $w->where('email', 'ILIKE', '%' . $request->search . '%')
                    ->orWhere('first_name', 'ILIKE', '%' . $request->search . '%')
                    ->orWhere('last_name', 'ILIKE', '%' . $request->search . '%');
            });
        }

        $admins = $admins->orderBy('created_at', 'DESC')->paginate($request->size);

        return returnResponse(true, MESSAGE_GET_SUCCESS, $admins, Response::HTTP_OK);
    }

    /**
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function getUserPlayer(Request $request)
    {
        // $adminTable = $request->admin_type == 'super' ? (new Super)->getTable() : (new Admin)->getTable();

        $authUser = Auth::User();

        $tenant_id = $request->post('tenant_id') ?? $authUser->tenant_id;
        $subscriber_id = $request->post('subscriber_id') ?? $authUser->subscriber_id;
        $adminId = $request->post('adminId');
        // dd($authUser);

        $query = SubscriberSystemUser::where('subscriber_id', $subscriber_id);
       


      

        if (!empty($request->search)) {

            $query = $query->where(function ($q) use ($request) {
                $q->orWhere(DB::raw('lower(name)'), 'like', '%' . strtolower($request->search) . '%')
                    ->orWhere(DB::raw('lower(user_code)'), 'like', '%' . strtolower($request->search) . '%');
            });
        }

        if (!empty($request->status)) {
            if ($request->status == "No")
                $query = $query->where('status', 0);
            else
                $query = $query->where('status', 1);
        }
        $filterUserIDs = [];
        if (!empty($request->online_status)) {
            $dupQuery = $query;
            $online_users = $dupQuery->select(['subscriber_id', 'id'])->get();
            if ($request->online_status == 'Yes') {

                $filterUserIDs = array_column($online_users->where('online_status', 1)->toArray(), 'id');
            } else {
                $filterUserIDs = array_column($online_users->where('online_status', 0)->toArray(), 'id');
            }
            $query = $query->whereIn((new SubscriberSystemUser)->getTable().'.id', $filterUserIDs);
            // $query->where('online_status', 1);
            // else
            // $query->where('online_status', 0);
        }
        $mytime = Carbon::now();
        $mytime =  $mytime->toDateTimeString();
        $record = $query
            ->select([(new SubscriberSystemUser)->getTable().'.*' , (new Bets)->getTable().'.created_at as last_bet'])->with(["freeBet" => function ($query) use($mytime){
                $query->where('num_of_free_bets','<>', 0);
                $query->where('end_date','>=', $mytime);   
            }])
            ->withCount('UserBets')
            ->leftJoin((new Bets)->getTable() , function($join){
                $join->on( 'user_id' ,'=',  (new SubscriberSystemUser)->getTable().'.id')
                ->on((new Bets)->getTable().'.created_at' , DB::raw('(select max('.(new Bets)->getTable().'.created_at) from '.(new Bets)->getTable().' where user_id = '.(new SubscriberSystemUser)->getTable().'.id)'));
            })
            ->groupBy( (new Bets)->getTable().'.created_at' , (new SubscriberSystemUser)->getTable().'.id' )
            ->orderBy($request->sort_by, $request->order)
            ->paginate($request->size ?? 10);
        return returnResponse(true, 'record get successfully.', $record, Response::HTTP_OK);

        // $record = $query->paginate($request->size ?? 10);

        // $custom = collect(['count' => $record->total()]);

        // $data = $custom->merge($record);

        // return returnResponse(true, 'record get successfully.', $data, Response::HTTP_OK);
    }

    /**
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function setting(Request $request)
    {

        $messages = array(
            'value.required' => 'VALIDATION_MSGS.VALUE.REQUIRED',
            'admin_user_id.required' => 'VALIDATION_MSGS.ADMIN_ID.REQUIRED'
        );

        $validatorArray = [
            'value' => 'required',
            'admin_user_id' => 'required|integer',
        ];

        $validator = Validator::make($request->all(), $validatorArray, $messages);

        if ($validator->fails()) {
            return returnResponse(false, '', $validator->errors(), Response::HTTP_BAD_REQUEST);
        } else {
            $findRecord = AdminUserSetting::where('admin_user_id', $request->admin_user_id)->first();

            if ($findRecord && count($findRecord->toArray()) > 0) {
                $findRecord->value = $request->value;
                $findRecord->update();
                return returnResponse(true, 'SENTENCES.UPDATED_SUCCESS', $findRecord->toArray(), Response::HTTP_OK, true);
            } else {
                $insertArray['admin_user_id'] = $request->admin_user_id;
                $insertArray['value'] = $request->value;
                $insertArray['key'] = COMMISSION_PERCENTAGE;
                AdminUserSetting::create($insertArray);
                return returnResponse(true, 'SENTENCES.CREATED_SUCCESS', $insertArray, Response::HTTP_CREATED, true);
            }
        }
    }

    /**
     * @param $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function deleteSetting($id)
    {

        $findRecord = AdminUserSetting::find($id);

        if ($findRecord && count($findRecord->toArray()) > 0) {
            $res = AdminUserSetting::where('id', $id)->delete();

            return returnResponse(true, 'SENTENCES.DELETED_SUCCESS', [], Response::HTTP_OK, true);
        }
        throw new \Exception('Record not found ');
    }


    /**
     * @param string $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function getAdminUserTree(Request $request)
    {
        $id = $request->id;

        try {

            if ($request->type == "super") {
                $findRecord = Super::select('id', DB::RAW("CONCAT(first_name, ' ', last_name) AS text"));
            } else {
                $findRecord = Admin::select(
                    'id',
                    DB::RAW("CONCAT(first_name, ' ', last_name, ' <br> &nbsp; &nbsp; &nbsp; &nbsp; players : ',
                (SELECT count(id) FROM users where parent_id=" . (new Admin)->getTable() . ".id)) AS text")
                );
            }

            if ($id) {
                $findRecord->where('parent_id', $id);
            } else {
                $findRecord->where('parent_id', Auth::User()->id);
            }

            $findRecord = $findRecord->get();

            if ($findRecord && count($findRecord->toArray()) > 0) {

                $style = "color: green; height: 50px;";

                if ($request->type == "super") {
                    $style = "color: green;";
                }

                foreach ($findRecord as $i => $rds) {
                    $findRecord[$i]->a_attr = ["style" => $style];
                }

                return response()->json($findRecord);
            } else {
                return response()->json([]);
            }
        } catch (\Exception $e) {
            return response()->json([]);
        }
    }

    /**
     * @param string $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function getAWSUrl(Request $request)
    {

        try {
            if ($request->keyname) {
                return returnResponse(true, 'Record Get Successfully.', ['url' => Aws3::getAwsUrl($request->keyname)], Response::HTTP_OK);
            } else {
                return returnResponse(false, 'SENTENCES.NOT_FOUND', [], Response::HTTP_OK);
            }
        } catch (\Exception $e) {
            return returnResponse(false, $e->getMessage(), [], Response::HTTP_EXPECTATION_FAILED, true);
        }
    }

    public function get_roles($type)
    {

        // $role = Auth::user()->role->first();

        // if($type == 'tenant'){
        //     $roles = AdminRole::whereIn('level', [$role->level, $role->level + 1])
        //     ->get();
        // }else if($type === 'super'){
        //     $roles = SuperRole::whereIn('level', [$role->level, $role->level + 1])
        //     ->get();
        // }

        // return returnResponse(true, "Records Found Successfully", $roles);

        $role = Auth::User()->role->first();

        $levels = [5];
        $sLevels = [3];

        if ($type == 'tenant') {

            switch ($role->level) {
                case 1:
                    $levels = [1, 2, 3, 4, 5];
                    break;

                case 2:
                    $levels = [2, 3, 4, 5];
                    break;

                case 3:
                    $levels = [3, 4, 5];
                    break;

                case 4:
                    $levels = [4, 5];
                    break;

                case 5:
                    $levels = [5];
                    break;

                default:
                    $levels = [5];
                    break;
            }

            $roles = AdminRole::whereIn('level', $levels)
                ->orderBy('level', 'ASC')->get();
        } else if ($type === 'super') {

            switch ($role->level) {
                case 1:
                    $sLevels = [1, 2, 3];
                    break;

                case 2:
                    $sLevels = [2, 3];
                    break;

                case 3:
                    $sLevels = [3];
                    break;

                default:
                    $sLevels = [3];
                    break;
            }

            $roles = SuperRole::whereIn('level', $sLevels)
                ->orderBy('level', 'ASC')->get();
        }

        return returnResponse(true, "Records Found Successfully", $roles);
    }

    public function get_permissions()
    {
        return returnResponse(true, "Records Found Successfully", ["permissions" => Auth::user()->permissions, "permission_titles" => PERMISSION_TITLES]);
    }

    public function getAdmins(Request $request)
    {
        $adminch = ($request->admin_type === 'tenant') ? new AdminModel : new Super;

        $adminch = $adminch->select(['id', 'first_name', 'last_name'])
            ->where('parent_id', $request->id)
            ->whereHas('role', function ($q) use ($request) {
                $q->where('level', $request->level);
            });

        $record = $adminch->orderBy('updated_at', 'DESC')->get();

        return returnResponse(true, "Records Found Successfully", $record);
    }

    public function getPlayerDetail($id){

        $player = SubscriberSystemUser::find($id);
    return returnResponse(true, "Record get Successfully", $player);
    }

}
