<?php

namespace App\Http\Controllers\Api\SubscriberSystem;

// Libraries
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Auth;
use Validator;
use Carbon\Carbon;
use Firebase\JWT\JWT;
use Firebase\JWT\Key;

// Models
use App\Models\SubscriberSystem\Subscriber;
use App\Models\TenantConfigurations;
use App\Models\Currencies;
use App\Models\OnlineGameSystem\CrashGameSettings;
use App\Models\OnlineGameSystem\FreeBetConfig;
use App\Models\Organization;
use App\Models\TenantCredentials;
use Illuminate\Support\Facades\Redis;

class SubscriberController extends Controller
{

    public function index(Request $request)
    {
        $query = Subscriber::select(['id', 'subscriber_name', 'domain', 'status', 'primary_currency','created_at'])->withCount('users');
        // $query->where(function($q) use($request){
        if (!empty($request->organization)) {
            $query = $query->where('organization_id', $request->organization);
        }

        if (!empty($request->org)) {
           $query = $query->where('organization_id', $request->org);
        }
        
        if (!empty($request->status)) {
            if ($request->status == 'Yes')
               $query = $query->where('status', 1);
            else{
              $query =  $query->whereIn('status', [0,3]);
            }
        }

        if (!empty($request->search)) {
            $query = $query->where(function($w) use ($request){
                $w->where('subscriber_name', 'ILIKE', '%' . $request->search . '%')
                ->orWhere('domain', 'ILIKE', '%' . $request->search . '%');
              });
         }

       
        $record =  $query->orderBy($request->sort_by, $request->order)->paginate($request->size ?? 10);

        return returnResponse(true, "Record get Successfully", $record);
    }

    public function all()
    {
        $record = Subscriber::where('status', 1)->select(['id', 'subscriber_name'])->orderBy('id', 'ASC')->get();

        return returnResponse(true, "Record get Successfully", $record);
    }

    public function store(Request $request)
    {
        $messages = array(
            'subscriber_name.required' => 'VALIDATION_MSGS.NAME.REQUIRED',
            'domain.required' => 'VALIDATION_MSGS.DOMAIN.REQUIRED',
            'domain.required' => 'VALIDATION_MSGS.LANGUAGE.REQUIRED',
            // 'domain.unique' => 'VALIDATION_MSGS.DOMAIN.UNIQUE',
            // 'domain.regex'=>'VALIDATION_MSGS.DOMAIN.VALID',
            'primary_currency.required' => 'VALIDATION_MSGS.PRIMARY_CURRENCY.REQUIRED',
            'currencies.required' => 'VALIDATION_MSGS.CURRENCY.REQUIRED',
            'trader_id.required' => 'VALIDATION_MSGS.TRADER_ID.REQUIRED',
            'trader_preference.required' => 'VALIDATION_MSGS.TRADER_PREFERENCE.REQUIRED'
        );

        $validator = Validator::make($request->all(), [
            'subscriber_name' => 'required',
            'domain' => 'required',
            'language' => 'required',
            'organization' => 'required',
            'primary_currency' => 'required',
            'currencies' => 'required',
            'trader_id' => 'required',
            'trader_preference' => 'required'
        ], $messages);

        if ($validator->fails()) {
            return returnResponse(false, '', $validator->errors(), Response::HTTP_BAD_REQUEST);
        }

        $domain = preg_replace("(^https?://)", "", $request->domain);
        $darr = [$domain, 'http://' . $domain, 'https://' . $domain];

        // if (Subscriber::whereIn('domain', $darr)->exists()) {
        //     return returnResponse(false, 'SENTENCES.DOMAIN_EXIST', [], Response::HTTP_BAD_REQUEST);
        // }

        if (Subscriber::whereIn('trader_preference', [$request->trader_preference])->whereIn('trader_id', [$request->trader_id])->exists()) {
            return returnResponse(false, 'SENTENCES.TRADER_PREFERENCE_EXIST', [], Response::HTTP_BAD_REQUEST);
        }

        // if(Subscriber::where('domain', $request->domain)->exists()) {
        //     return returnResponse(false, 'SENTENCES.DOMAIN_EXIST',[ ] ,Response::HTTP_BAD_REQUEST);
        // }

        DB::beginTransaction();
        $insertData = [
            'subscriber_name' => $request->subscriber_name,
            'domain'  => $request->domain,
            'language'  => $request->language,
            'organization_id' => $request->organization,
            'super_admin_user_id' => Auth::User()->id,
            'primary_currency' => $request->primary_currency,
            'auth' => $request->auth_api,
            'credit' => $request->credit_api,
            'debit' => $request->debit_api,
            'rollback' => $request->rollback_api,
            'trader_id' => $request->trader_id,
            'trader_preference' => $request->trader_preference,
            'created_at' => Carbon::now()->toDateTimeString(),
            'modified_at' => Carbon::now()->toDateTimeString(),
        ];

        if (!$request->auth_api || !$request->credit_api || !$request->debit_api || !$request->rollback_api)
            $insertData['status'] = 3;
        else
            $insertData['status'] = 0;
        $subscriber = Subscriber::create($insertData);

        if (!empty($subscriber)) {

            $postDataSubscriber['subscriber_id'] = $subscriber->id;

            $primaryCurrency = Currencies::select(['id'])->where('primary', true)->first();
            $tenCurrencies = array_unique(array_merge($request->currencies, [$primaryCurrency->id]));

            // $postDataSubscriber['allowed_currencies'] = '{'.implode(',', $request->currencies).'}';
            $postDataSubscriber['allowed_currencies'] = '{' . implode(',', $tenCurrencies) . '}';
            $postDataSubscriber['multi_bet'] = 1;
            $postDataSubscriber['graph'] = 1;
            $postDataSubscriber['flew_away_sound'] = env('AWS_URL') . 'sounds/flew-away1.mp3';
            $postDataSubscriber['start_sound'] =  env('AWS_URL') . 'sounds/start.mp3';
            $postDataSubscriber['bg_sound'] =  env('AWS_URL') . 'sounds/vecihi.mp3';
            TenantConfigurations::create($postDataSubscriber);

            // genrate secret and public key
            $key = Str::uuid();
            
            Subscriber::where('id', $subscriber->id)->update([
                'secret_key' => $request->secret_key ? $request->secret_key : $key
            ]);

            setRedisCredentials('sub_' . $subscriber->id, 'subscriber', 'SECRET_KEY', $key);

            //crash-game-setting

            if (!empty($request->currencies)) {
                $c_min_amt = [];
                $c_max_amt = [];
                $c_max_profit = [];
                foreach ($request->currencies as $cur) {
                    $curncy = Currencies::where('id', $cur)->first();
                    $c_min_amt[$curncy->code] = "1.0";
                    $c_max_amt[$curncy->code] = "10.0";
                    $c_max_profit[$curncy->code] = "0.1";
                }
                if (in_array($primaryCurrency->id, $request->currencies)) {
                } else {
                    $curncy = Currencies::where('id', $primaryCurrency->id)->first();
                    $c_min_amt[$curncy->code] = "1.0";
                    $c_max_amt[$curncy->code] = "10.0";
                    $c_max_profit[$curncy->code] = "0.1";
                }
                $crashGameSetting = [
                    "id" => $subscriber->id,
                    "subscriber_id" => $subscriber->id,
                    "min_bet" => json_encode($c_min_amt),
                    "max_bet" => json_encode($c_max_amt),
                    "max_profit" => json_encode($c_max_profit),
                ];

                CrashGameSettings::create($crashGameSetting);
            }

        }

        DB::commit();

        return returnResponse(true, 'SENTENCES.CREATED_SUCCESS', [], Response::HTTP_OK, true);
    }

    public function getOrgSubscriber($id){
        $query = Subscriber::select(['id', 'subscriber_name'])
        ->where('organization_id',$id)->get();
        return returnResponse(true, "Record get Successfully", $query);
    }

    public function show($id)
    {
        $subscriber = Subscriber::with(['crashGameSetting'])->select(['id', 'subscriber_name', 'domain', 'primary_currency', 'status', 'language', 'organization_id', 'auth', 'credit', 'debit', 'rollback','trader_id','trader_preference','secret_key'])->find($id);
        $subscriber->config = TenantConfigurations::select('*')->where('subscriber_id', $id)->get();

        $configurations = TenantConfigurations::select('allowed_currencies')->where('subscriber_id', $id)->get();
        $configurations = $configurations->toArray();

        // $subscriber->theme = TenantThemeSettings::select(['primary_color', 'secondry_color', 'theme_mode', 'theme_options'])->where('subscriber_id', $id)->first();

        $subscriber->configurations = array();

        if (count($configurations) > 0) {
            $configurations = $configurations[0];

            if (strlen($configurations['allowed_currencies']) > 1) {
                $configurations = str_replace('{', '', $configurations['allowed_currencies']);
                $configurations = str_replace('}', '', $configurations);
                $configurations = explode(',', $configurations);

                if (@$configurations[0] && count($configurations) > 0) {
                    $CurrenciesValue = Currencies::select('id', 'name', 'code')->whereIn('id', $configurations)->get();
                    $subscriber->configurations = $CurrenciesValue->toArray();
                }
            }
        }

        return returnResponse(true, "Record get Successfully", $subscriber);
    }

    public function getSubscriberCurrencies()
    {
        $configurations = TenantConfigurations::select('allowed_currencies')->where('subscriber_id', Auth::User()->subscriber_id)->get();
        $configurations = $configurations->toArray();

        $currencies = array();

        if (count($configurations) > 0) {
            $configurations = $configurations[0];

            if (strlen($configurations['allowed_currencies']) > 1) {
                $configurations = str_replace('{', '', $configurations['allowed_currencies']);
                $configurations = str_replace('}', '', $configurations);
                $configurations = explode(',', $configurations);

                if (@$configurations[0] && count($configurations) > 0) {
                    $CurrenciesValue = Currencies::select('id', 'name', 'code')->whereIn('id', $configurations)->get();
                    $currencies = $CurrenciesValue->toArray();
                }
            }
        }

        return returnResponse(true, "Record get Successfully", $currencies);
    }

    public function update(Request $request)
    {

        $messages = array(
            'id.required' => 'VALIDATION_MSGS.ID.REQUIRED',
            'subscriber_name.required' => 'VALIDATION_MSGS.NAME.REQUIRED',
            'domain.required' => 'VALIDATION_MSGS.DOMAIN.REQUIRED',
            // 'domain.unique' => 'VALIDATION_MSGS.DOMAIN.UNIQUE',
            // 'domain.regex'=>'VALIDATION_MSGS.DOMAIN.VALID',
            'currencies.required' => 'VALIDATION_MSGS.CURRENCY.REQUIRED',
            'trader_id.required' => 'VALIDATION_MSGS.TRADER_ID.REQUIRED',
            'trader_preference.required' => 'VALIDATION_MSGS.TRADER_PREFERENCE.REQUIRED'
        );

        $validator = Validator::make($request->all(), [
            'id' => 'required',
            'subscriber_name' => 'required',
            'language' => 'required',
            'organization' => 'required',
            'domain' => 'required',
            'trader_id' => 'required',
            'trader_preference' => 'required'
        ], $messages);

        if ($validator->fails()) {
            return returnResponse(false, '', $validator->errors(), Response::HTTP_BAD_REQUEST);
        }

        $subscriber = Subscriber::find($request->id);

        if (empty($subscriber)) {
            return returnResponse(false, 'SENTENCES.NOT_FOUND', [], 404);
        }

        $domain = preg_replace("(^https?://)", "", $request->domain);
        $darr = [$domain, 'http://' . $domain, 'https://' . $domain];

        // if (Subscriber::whereIn('domain', $darr)->whereNotIn('id', [$request->id])->exists() ) {
        //     return returnResponse(false, 'SENTENCES.DOMAIN_EXIST', [], Response::HTTP_BAD_REQUEST);
        // }

        if (Subscriber::whereIn('trader_preference', [$request->trader_preference])->whereIn('trader_id', [$request->trader_id])->whereNotIn('id', [$request->id])->exists() ) {
            return returnResponse(false, 'SENTENCES.TRADER_PREFERENCE_EXIST', [], Response::HTTP_BAD_REQUEST);
        }

        // if(Subscriber::where('domain', $request->domain)->whereNotIn('id', [ $request->id ])->exists()) {
        //     return returnResponse(false, 'SENTENCES.DOMAIN_EXIST',[ ] ,Response::HTTP_BAD_REQUEST);
        // }

        $primaryCurrency = Currencies::select(['id'])->where('primary', true)->first();
        $tenCurrencies = array_unique(array_merge($request->currencies, [$primaryCurrency->id]));

        if (!empty($request->currencies)) {
            $c_min_amt = [];
            $c_max_amt = [];
            $c_max_profit = [];
            $crashsetting = CrashGameSettings::where('id', $request->id)->first();
            $c_min_amt = json_decode($crashsetting->min_bet, true);
            $c_max_amt = json_decode($crashsetting->max_bet, true);
            $c_max_profit = json_decode($crashsetting->max_profit, true);
  
            foreach ($request->currencies as $cur) {
                $curncy = Currencies::where('id', $cur)->first();          
                // $chkcurrency = SportsBetSetting::where('subscriber_id', $request->id)->where('currency_code', $curncy->code)->first();

                if(!isset($c_min_amt[$curncy->code])) {
                    // dd('hi');
                    $c_min_amt[$curncy->code] = "1.0";
                    $c_max_amt[$curncy->code] = "10.0";
                    $c_max_profit[$curncy->code] = "0.1";
                }
            }
            $crashsetting->min_bet = json_encode($c_min_amt);
            $crashsetting->max_bet = json_encode($c_max_amt);
            $crashsetting->max_profit = json_encode($c_max_profit);
            $crashsetting->save();
        }


        // $postDataSubscriber['allowed_currencies'] = '{'.implode(',', $request->currencies).'}';
        $postDataSubscriber['allowed_currencies'] = '{' . implode(',', $tenCurrencies) . '}';
        TenantConfigurations::where(['subscriber_id' => $request->id])->update($postDataSubscriber);

        DB::beginTransaction();
        $insertData = [
            'subscriber_name'  => $request->subscriber_name,
            'domain'  => $request->domain,
            'language' => $request->language,
            'organization_id'  => $request->organization,
            'auth' => $request->auth_api,
            'credit' => $request->credit_api,
            'debit' => $request->debit_api,
            'rollback' => $request->rollback_api,
            'trader_id' => $request->trader_id,
            'trader_preference' => $request->trader_preference,
            'modified_at' => Carbon::now()->toDateTimeString()
        ];
        if (!$request->auth_api || !$request->credit_api || !$request->debit_api || !$request->rollback_api)
            $insertData['status'] = 3;
        else
            $insertData['status'] = 0;
        $subscriber->update($insertData);
        DB::commit();

        return returnResponse(true, 'SENTENCES.UPDATED_SUCCESS', [], Response::HTTP_OK, true);
    }

    public function updateStatus(Request $request)
    {

        $messages = array(
            'id.required' => 'VALIDATION_MSGS.ID.REQUIRED',
            'status.required' => 'VALIDATION_MSGS.STATUS.REQUIRED',
        );

        $validator = Validator::make($request->all(), [
            'id' => 'required',
            'status' => 'required'
        ], $messages);

        if ($validator->fails()) {
            return returnResponse(false, '', $validator->errors(), Response::HTTP_BAD_REQUEST);
        }

        $subscriber = Subscriber::find($request->id);

        if (empty($subscriber)) {
            return returnResponse(false, 'SENTENCES.NOT_FOUND', [], 404);
        }

        $org = Organization::where('id', $subscriber->organization_id)->first();
        if ($org->status == 0)
            return returnResponse(false, 'Organization deactivated', [], 403, true);

        if (!$subscriber->auth || !$subscriber->credit || !$subscriber->debit || !$subscriber->rollback)
            return returnResponse(false, 'SENTENCES.CREDENTIAL_SUBSCRIBER_ACTIVE', [], 403, true);
        DB::beginTransaction();
        $subscriber->update([
            'status'  => $request->status,
            'modified_at' => Carbon::now()->toDateTimeString()
        ]);
        DB::commit();

        return returnResponse(true, 'SENTENCES.UPDATED_SUCCESS', [], Response::HTTP_OK, true);
    }

    public function updateHero(Request $request)
    {
        $config = TenantConfigurations::find($request->id);

        if ($request->graph_colour)
            $config->graph_colour = $request->graph_colour;

        if ($request->loader_colour)
            $config->loader_colour = $request->loader_colour;

        if ($request->multi_bet)
            $config->multi_bet = $request->multi_bet;

        if ($request->graph) {
            if ($request->graph == 1)
                $config->graph = $request->graph;
            else
                $config->graph = 0;
        }



        if (@$request->file('jsonFile')) {
            $fileNamePath = $request->id . '/plane.json';
            $s3Path = Storage::disk('s3')->put(
                $fileNamePath,
                file_get_contents($request->file('jsonFile')),
                'public'
            );
            $config->hero_json = env('AWS_URL') . $fileNamePath;
        }


        if (@$request->file('pngFile')) {
            $fileNamePath = $request->id . '/plane.png';
            $s3Path = Storage::disk('s3')->put(
                $fileNamePath,
                file_get_contents($request->file('pngFile')),
                'public'
            );
            $config->hero_png = env('AWS_URL') . $fileNamePath;
        }

        if (@$request->file('bgJsonFile')) {
            $fileNamePath = $request->id . '/bg.json';
            $s3Path = Storage::disk('s3')->put(
                $fileNamePath,
                file_get_contents($request->file('bgJsonFile')),
                'public'
            );
            $config->bg_json = env('AWS_URL') . $fileNamePath;
        }

        if (@$request->file('bgPngFile')) {
            $fileNamePath = $request->id . '/bg.png';
            $s3Path = Storage::disk('s3')->put(
                $fileNamePath,
                file_get_contents($request->file('bgPngFile')),
                'public'
            );
            $config->bg_png = env('AWS_URL') . $fileNamePath;
        }
        if (@$request->file('startAnimJsonFile')) {
            $fileNamePath = $request->id . '/startAnim.json';
            $s3Path = Storage::disk('s3')->put(
                $fileNamePath,
                file_get_contents($request->file('startAnimJsonFile')),
                'public'
            );
            $config->start_anim_json = env('AWS_URL') . $fileNamePath;
        }

        if (@$request->file('startAnimPngFile')) {
            $fileNamePath = $request->id . '/startAnim.png';
            $s3Path = Storage::disk('s3')->put(
                $fileNamePath,
                file_get_contents($request->file('startAnimPngFile')),
                'public'
            );
            $config->start_anim_png = env('AWS_URL') . $fileNamePath;
        }
        if (@$request->file('crashAnimJsonFile')) {
            $fileNamePath = $request->id . '/crashAnim.json';
            $s3Path = Storage::disk('s3')->put(
                $fileNamePath,
                file_get_contents($request->file('crashAnimJsonFile')),
                'public'
            );
            $config->crash_anim_json = env('AWS_URL') . $fileNamePath;
        }

        if (@$request->file('crashAnimPngFile')) {
            $fileNamePath = $request->id . '/crashAnim.png';
            $s3Path = Storage::disk('s3')->put(
                $fileNamePath,
                file_get_contents($request->file('crashAnimPngFile')),
                'public'
            );
            $config->crash_anim_png = env('AWS_URL') . $fileNamePath;
        }
        $config->save();
        return returnResponse(true, 'SENTENCES.UPDATED_SUCCESS', [], Response::HTTP_OK, true);
    }

    public function updateSound(Request $request)
    {
        $config = TenantConfigurations::find($request->id);

        if (@$request->file('start_sound')) {
            $fileNamePath = $request->id . '/start_sound.mp3';
            $s3Path = Storage::disk('s3')->put(
                $fileNamePath,
                file_get_contents($request->file('start_sound')),
                'public'
            );
            $config->start_sound = env('AWS_URL') . $fileNamePath;
        }


        if (@$request->file('bg_sound')) {
            $fileNamePath = $request->id . '/bg_sound.mp3';
            $s3Path = Storage::disk('s3')->put(
                $fileNamePath,
                file_get_contents($request->file('bg_sound')),
                'public'
            );
            $config->bg_sound = env('AWS_URL') . $fileNamePath;
        }

        if (@$request->file('flew_away_sound')) {
            $fileNamePath = $request->id . '/flew_away_sound.mp3';
            $s3Path = Storage::disk('s3')->put(
                $fileNamePath,
                file_get_contents($request->file('flew_away_sound')),
                'public'
            );
            $config->flew_away_sound = env('AWS_URL') . $fileNamePath;
        }
        $config->save();
        return returnResponse(true, 'SENTENCES.UPDATED_SUCCESS', [], Response::HTTP_OK, true);
    }

    public function getSound($id)
    {
        $config = TenantConfigurations::find($id);
        return returnResponse(true, "Record get Successfully", $config);
    }

    public function setDefault(Request $request)
    {
        $config = TenantConfigurations::find($request->id);
        if ($request->type == 1 || $request->type == 10) {
            $config->hero_json = NULL;
            $config->hero_png = NULL;
        }
        if ($request->type == 2 || $request->type == 10) {
            $config->bg_json = NULL;
            $config->bg_png = NULL;
        }
        if ($request->type == 3 || $request->type == 10) {
            $config->flew_away_sound = env('AWS_URL') . 'sounds/flew-away1.mp3';
            $config->start_sound =  env('AWS_URL') . 'sounds/start.mp3';
            $config->bg_sound =  env('AWS_URL') . 'sounds/vecihi.mp3';
        }
        if ($request->type == 4 || $request->type == 10) {
            $config->start_anim_json = NULL;
            $config->start_anim_png = NULL;
        }
        if ($request->type == 5 || $request->type == 10) {
            $config->crash_anim_json = NULL;
            $config->crash_anim_png = NULL;
        }
        if ($request->type == 6 || $request->type == 10) {
            $config->graph_colour = '0xc56f25';
        }
        if ($request->type == 7 || $request->type == 10) {
            $config->loader_colour = '0xc56f25';
        }
        $config->save();
        return returnResponse(true, 'SENTENCES.UPDATED_SUCCESS', [], Response::HTTP_OK, true);
    }
}
