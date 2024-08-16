<?php

namespace App\Http\Controllers\Api;

# Controller
use App\Http\Controllers\Api\MailController;

use App\Http\Controllers\Controller;
use Illuminate\Validation\Rule;

// Models
use App\Models\SubscriberSystem\Subscriber;
use App\Models\Transactions;
use App\Models\Admin;
use App\Models\Tenants;
use App\Models\TenantConfigurations;
use App\Models\TenantThemeSettings;
use App\Models\Currencies;

// use App\Models\TenantSportsBetSetting;
use App\Models\SportsBetSetting;
use App\Models\PageBanners;
use App\Models\AdminUsersAdminRoles;
use App\Models\AdminRole;
use App\Models\Wallets;
use App\Models\AdminUserPermission;
use App\Models\Admin as AdminModel;
use App\Models\Bonus as BonusModel;
use App\Models\SubscribedPackage;
use App\Models\Package;
use App\Models\SlotSystem\OperatorGame;
use App\Models\SlotSystem\SlotGame;
use App\Models\SlotSystem\SlotMasterTheme;

use Illuminate\Http\Request;
use Validator;
use Illuminate\Support\Facades\DB;
use App\Models\TenantCredentials;
use App\Models\TenantCredentialsKeys;
use Illuminate\Support\Facades\Storage;
use App\Aws3;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Auth;
use Illuminate\Http\Response;
use App;
use Illuminate\Support\Facades\Hash;
use App\Http\Middleware\Superadmin;
use App\Jobs\AdminChangePasswordMail;
use App\Jobs\NewAdminMail;
use App\Jobs\SuperAdminChangePasswordMail;
use App\Models\OnlineGameSystem\CrashGameSettings;
use App\Models\OnlineGameSystem\FreeBetConfig;
use App\Models\OnlineGameSystem\CrashGameGlobalSetting;
use App\Models\Organization;
use App\Models\Super;
use App\Models\Themes;
// use App\Models\SuperAdminWallets;
use Carbon\Carbon;
use Firebase\JWT\JWT;
use Firebase\JWT\Key;

class TenantsController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */

    /**
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */

    public function getThemeSetting(Request $request)
    {
        try {
            $id = Auth::User()->tenant_id;
            $where = "tenant_id";

            $data = array();

            if ($request->type == "subscriber") {
                $id = Auth::User()->subscriber_id;
                $where = 'subscriber_id';

                $subscriber = Subscriber::select('subscriber_name')->find($id);
                $data['name'] = $subscriber->subscriber_name;
            } else {
                $tenant = Tenants::select('name')->find($id);
                $data['name'] = $tenant->name;
            }

            $setting = @TenantThemeSettings::where($where, $id)->first();
            $data['setting'] = $setting;
            return returnResponse(true, "Record get Successfully", $data, Response::HTTP_OK, true);
        } catch (\Exception $e) {
            return returnResponse(false, ERROR_MESSAGE, [], Response::HTTP_EXPECTATION_FAILED);
        }
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */

    /**
     * Display the specified resource.
     *
     * @param  \App\Models\Tenants  $tenants
     * @return \Illuminate\Http\Response
     */

    public function tanantCurrencies($id, Request $request)
    {

        try {

            $where = 'tenant_id';
            if ($request->type == "subscriber") {
                $where = 'subscriber_id';
            }

            $configurations = TenantConfigurations::select('allowed_currencies')->where($where, $id)->get();
            $configurations = $configurations->toArray();

            $CurrenciesValue = [];

            if ($configurations) {

                $configurations = $configurations[0];
                if (strlen($configurations['allowed_currencies']) > 1) {

                    $configurations = str_replace('{', '', $configurations['allowed_currencies']);
                    $configurations = str_replace('}', '', $configurations);
                    $configurations = explode(',', $configurations);

                    if (@$configurations[0] && count($configurations) > 0) {
                        $CurrenciesValue = Currencies::select('id', 'name', 'code')->whereIn('id', $configurations)->get();
                        $CurrenciesValue = $CurrenciesValue->toArray();
                    }
                }
            }

            return returnResponse(true, "Record get Successfully", $CurrenciesValue, Response::HTTP_OK, true);
        } catch (\Exception $e) {

            if (!App::environment(['local'])) { //, 'staging'
                return returnResponse(false, ERROR_MESSAGE, [], Response::HTTP_EXPECTATION_FAILED);
            } else {
                return returnResponse(false, ERROR_MESSAGE, [
                    'Error' => $e->getMessage(),
                    'LineNo' => $e->getLine(),
                    'FileName' => $e->getFile()
                ], Response::HTTP_EXPECTATION_FAILED);
            }
        }
    }

    /**
     * Update the specified resource in storage.  tenant_configurations,tenant_credentials,tenant_theme_settings we need to work
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Models\Tenants  $tenants
     * @return \Illuminate\Http\Response
     */


    public function getTenantCrashGameSetting(Request $request)
    {
        try {
            $crashGameSetting = CrashGameGlobalSetting::where('id', '=', 1)
                ->get();


            if (empty($crashGameSetting)) {
                return returnResponse(false, 'Setting Not found', [], Response::HTTP_NOT_FOUND);
            }

            return returnResponse(true, "Record get Successfully", $crashGameSetting, 200, true);
        } catch (\Exception $e) {

            if (!App::environment(['local'])) { //, 'staging'
                return returnResponse(false, ERROR_MESSAGE, [], Response::HTTP_EXPECTATION_FAILED);
            } else {
                return returnResponse(false, ERROR_MESSAGE, [
                    'Error' => $e->getMessage(),
                    'LineNo' => $e->getLine(),
                    'FileName' => $e->getFile()
                ], Response::HTTP_EXPECTATION_FAILED);
            }
        }
    }

    public function updateTenantCrashGameSetting(Request $request)
    {
        $messages = array(
            'max_odd.required' => 'VALIDATION_MSGS.MAX_ODD.REQUIRED',
            'min_odd.required' => 'VALIDATION_MSGS.MIN_ODD.REQUIRED',
            'house_edge.required' => 'VALIDATION_MSGS.HOUSE_EDGE.REQUIRED',
            'min_auto_rate.required' => 'VALIDATION_MSGS.MIN_AUTO_RATE.REQUIRED',
            'betting_period.required' => 'VALIDATION_MSGS.BETTING_PERIOD.REQUIRED',
            'betting_period.integer' => 'VALIDATION_MSGS.BETTING_PERIOD.INTEGER',
            'betting_period.between' => 'VALIDATION_MSGS.BETTING_PERIOD.BETWEEN',
        );

        $validationArray = [
            'max_odd' => 'required',
            'min_odd' => 'required',
            'house_edge' => 'required',
            'min_auto_rate' => 'required',
            'betting_period' => 'required|integer|between:4,20',
        ];
        $validator = Validator::make($request->all(), $validationArray, $messages);

        if ($validator->fails()) {
            return returnResponse(false, '', $validator->errors(), 400);
        }
        $crashGameSetting = CrashGameSettings::where('id', 1)->first();
        if (empty($crashGameSetting)) {
            return returnResponse(false, 'SENTENCES.NOT_FOUND', [], Response::HTTP_NOT_FOUND);
        }

        $postData = [
            'max_odds' => $request->max_odd,
            'min_odds' => $request->min_odd,
            'house_edge' => $request->house_edge,
            'min_auto_rate' => $request->min_auto_rate,
            'betting_period' => $request->betting_period,
        ];

        $query = CrashGameGlobalSetting::where('id', 1)->update($postData);


        return returnResponse(true, "SENTENCES.UPDATED_SUCCESS", [], 200, true);
    }




    public function uploadImages(Request $request)
    {
        if (@$request->file('backgroundImage')) {

            $aws3 = new Aws3();

            $fileName = Str::uuid() . '____' . $request->file('backgroundImage')->getClientOriginalName();
            $fileName = str_replace(' ', '_', $fileName);

            $fileNamePath = "backgroundImage/" . $fileName;
            // dd( $request->file('backgroundImage')->getPathname(),$request->file('backgroundImage')->getClientMimeType());
            $PathS3Key = $aws3->uploadFile($fileNamePath, $request->file('backgroundImage')->getPathname(), $request->file('backgroundImage')->getClientMimeType());

            $data['background_image_url'] = env('AWS_URL') . @$PathS3Key;
            // dd($data);
            return returnResponse(true, 'SENTENCES.UPDATED_SUCCESS', $data, 200, true);
        } else {
            return returnResponse(true, 'VALIDATION_MSGS.FILE.REQUIRED', [], 403, true);
        }
    }

    public function updateCrashGameSettingCurrency($type, $id, $tab_name, Request $request)
    {
        $c = [];
        foreach ($request->all() as $cur) {
            if($cur[0] != '' && $cur[0] != null && isset($cur[0]) && $cur[1] != '' && $cur[1] != null && isset($cur[1])){
                $c[$cur[0]] = $cur[1];
            }
        }
        // dd($c);
        // dd($request->all());
        CrashGameSettings::where('subscriber_id', $id)->update([$tab_name => json_encode($c)]);
        return returnResponse(true, "SENTENCES.UPDATED_SUCCESS", [], 200, true);
    }

    // Admin

    public function checkTenSub(Request $request)
    {

        $domain = getDomain($request->getHttpHost());
        $subscriber = Subscriber::select('domain')->where('domain', 'ilike', '%' . $domain . '%')->first();
        if (!empty($subscriber)) {
            $subscriber['type'] = 'subscriber';
            return returnResponse(true, '', $subscriber, Response::HTTP_OK, true);
        } else {
            return returnResponse(true, '', [], Response::HTTP_OK, true);
        }
    }

    public function getTenantCrashGameBetSettingCurrency(Request $request)
    {

        try {
            $tenantCrashGameSetting = CrashGameSettings::select("$request->type")->where('subscriber_id', $request->id)->get();

            if (empty($tenantCrashGameSetting)) {
                return returnResponse(false, 'Setting Not found', [], Response::HTTP_NOT_FOUND);
            }


            return returnResponse(true, "Record get Successfully", $tenantCrashGameSetting, 200, true);
        } catch (\Exception $e) {

            if (!App::environment(['local'])) { //, 'staging'
                return returnResponse(false, ERROR_MESSAGE, [], Response::HTTP_EXPECTATION_FAILED);
            } else {
                return returnResponse(false, ERROR_MESSAGE, [
                    'Error' => $e->getMessage(),
                    'LineNo' => $e->getLine(),
                    'FileName' => $e->getFile()
                ], Response::HTTP_EXPECTATION_FAILED);
            }
        }
    }

    public function createOrganization(Request $request)
    {
        $messages = [
            'name.required' => 'VALIDATION_MSGS.NAME.REQUIRED',
        ];

        $validator = Validator::make($request->all(), [
            'name' => 'required',
        ], $messages);

        if ($validator->fails()) {
            return returnResponse(false, '', $validator->errors(), 400);
        }
        $insertData = [
            'name'  => $request->name,
            'status' => 1,
        ];

        $createdValues = Organization::create($insertData);
        if ($createdValues) {
            return returnResponse(true, 'insert successfully.', $insertData, 200, true);
        } else {
            return returnResponse(false, 'insert unsuccessfully.', [], 403, true);
        }
    }

    public function getOrganizations()
    {
        $record = Organization::withCount('subscribers')->get();
        return returnResponse(true, "Record get Successfully", $record);
    }

    public function getOrganization($id)
    {
        $record = Organization::find($id);
        return returnResponse(true, "Record get Successfully", $record);
    }

    public function updateOrganization(Request $request)
    {
        $org = Organization::where('id', $request->id)->first();

        if (!$org) {
            return returnResponse(false, 'SENTENCES.NOT_FOUND', [], 404, true);
        } else {

            $postData['name'] = $request->name;

            Organization::where(['id' => $request->id])->update($postData);
            return returnResponse(true, 'SENTENCES.UPDATED_SUCCESS', Currencies::find($request->id), 200, true);
        }
    }

    public function updateOrganizationStatus(Request $request)
    {
        $org = Organization::where('id', $request->id)->first();

        if (!$org) {
            return returnResponse(false, 'SENTENCES.NOT_FOUND', [], 404, true);
        } else {

            $postData['status'] = $request->status;
            Organization::where(['id' => $request->id])->update($postData);
        }
        if ($request->status == 0) {
            $postData['status'] = 0;
            Subscriber::where(['organization_id' => $request->id])->update($postData);
        }
        return returnResponse(true, 'SENTENCES.UPDATED_SUCCESS', Organization::find($request->id), 200, true);
    }

    public function getOrganizationsAll(Request $request)
    {
        $record = Organization::withCount('subscribers');
        if (!empty($request->search)) {
            $record->where('name', 'ILIKE', '%' . $request->search . '%');
        }
        if (!empty($request->status)) {
            if ($request->status == 'Yes')
                $record->where('status', 1);
            else
                $record->where('status', 0);
        }
        $record =  $record->orderBy($request->sort_by, $request->order)->paginate($request->size ?? 10);
        return returnResponse(true, "Record get Successfully", $record);
    }

    public function deleteOrganization($id)
    {
        $vehicle = Organization::find($id);
        $vehicle->delete();
        return returnResponse(true, 'record deleted successfully.', [], Response::HTTP_OK, true);
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

        $admin = Super::find($request->id);

        if(empty($admin)) {
            return returnResponse(true, 'SENTENCES.NOT_FOUND',[ ], 404, true);
        }
        if (!Hash::check($request->old_password, $admin->encrypted_password)) {
            return returnResponse(true, 'Old Password does not match',[ ], 403, true);
        }
        DB::beginTransaction();

            $insertData = [];

            if(!empty($request->encrypted_password)) {
                $newpassword = base64_decode($request->encrypted_password);
                $insertData['encrypted_password']=bcrypt($newpassword);
            }

            $admin->update($insertData);

            // if(!empty($request->encrypted_password)) {
            //     $admin->newpassword = $newpassword;
            //     try {
            //         $data = array(
            //             'first_name' => $admin->first_name,
            //             'last_name'=>$admin->last_name,
            //             'newpassword'=>$newpassword,
            //             'email'=>$admin->email
            //         );
            //         // (new MailController)->subscriberAdminChangePassword($admin);
            //         SuperAdminChangePasswordMail::dispatch((object)$data);
            //     } catch (\Exception $e) { }
            // }

        DB::commit();

        return returnResponse(true, 'SENTENCES.UPDATED_SUCCESS', [], Response::HTTP_OK, true);
    }

}
