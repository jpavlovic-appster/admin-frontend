<?php




namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Validator;
use Illuminate\Support\Facades\DB;
use App\Models\Currencies;
use App\Models\Super;
use App\Models\Wallets;
use Illuminate\Support\Facades\Date;

class CurrenciesController extends Controller
{


    public function getPrimaryCurrency()
    {
        return returnResponse(true, "Record get Successfully", Currencies::where('primary', true)->first());
    }

    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        return returnResponse(true, "Record get Successfully", Currencies::select("*" , DB::raw('code , code as currency_code'))->orderBy('name', 'ASC')->get());
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */


    public function store(Request $request)
    {

        $messages = [
            'name.required' => 'VALIDATION_MSGS.NAME.REQUIRED',
            'code.required' => 'VALIDATION_MSGS.CODE.REQUIRED',
            'code.unique' => 'VALIDATION_MSGS.CODE.UNIQUE',
            'exchange_rate.required' => 'VALIDATION_MSGS.EXCHAANGE_RATE.REQUIRED',
        ];

        $validator = Validator::make($request->all(), [
            'name' => 'required',
            'code' => 'required|unique:currencies',
            'exchange_rate' => 'required',
        ], $messages);

        if ($validator->fails()) {
            return returnResponse(false, '', $validator->errors(), 400);
        }

        $insertData = [
            'name'  => $request->name,
            'code'      => strtoupper($request->code),
            'symbol'      => $request->symbol,
            'exchange_rate'   => $request->exchange_rate,
        ];
        $createdValues = Currencies::create($insertData);
        if ($createdValues) {
            $superAdmins = Super::get();
            $WalletInsertArr = [];
            foreach ($superAdmins as $superAdmin) {
                $insertWallets['owner_id'] = $superAdmin->id;
                $insertWallets['currency_code'] = strtoupper($request->code);
                $insertWallets['owner_type'] = SUPER_ADMIN_TYPE;
                $insertWallets['created_at'] = Date::now();
                $insertWallets['updated_at'] = Date::now();
                array_push($WalletInsertArr, $insertWallets);
            }
            Wallets::insert($WalletInsertArr);
            return returnResponse(true, 'SENTENCES.CREATED_SUCCESS', $insertData, 200, true);
        } else {
            return returnResponse(false, 'SENTENCES.CREATED_FAIL', [], 403, true);
        }
    }

    /**
     * Display the specified resource.
     *
     * @param  \App\Models\Currencies  $currencies
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {


        if ($id == '') {
            return returnResponse(true, "Record get Successfully", Currencies::all());
        } else {

            return returnResponse(true, "Record get Successfully", Currencies::find($id)->toArray(), 200, true);
        }
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Models\Currencies  $currencies
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, Currencies $currencies)
    {
        $currencies = $currencies->where('id', $request->id)->first();

        $currencyCodeExists = Currencies::where('code', strtoupper($request->code))
            ->first();

        // $currencySymbolExists = Currencies::where('symbol', strtoupper($request->symbol))
        // ->first();

        if (!$currencies) {
            return returnResponse(false, 'SENTENCES.NOT_FOUND', [], 404, true);
        } else {

            if ($currencyCodeExists && $currencyCodeExists->id != $request->id) {
                return returnResponse(false, 'SENTENCES.CODE_EXIST', [], 400, true);
            }

            // if($currencySymbolExists && $currencySymbolExists->id != $request->id){
            //     return returnResponse(false,'Symbol already taken',[],400,true);
            // }

            $input = $request->all();
            $postData['name'] = $input['name'];
            $postData['code'] = strtoupper($input['code']);
            $postData['symbol'] = $input['symbol'];
            $postData['exchange_rate'] = $input['exchange_rate'];

            Currencies::where(['id' => $request->id])->update($postData);
            return returnResponse(true, 'SENTENCES.UPDATED_SUCCESS', Currencies::find($request->id), 200, true);
        }
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Models\Currencies  $currencies
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        $currencies = Currencies::where('id', $id)->get();
        $currenciesArray = $currencies->toArray();
        if (!count($currenciesArray)) {
            return returnResponse(false, 'SENTENCES.NOT_FOUND', [], 404, true);
        } else {
            Currencies::where(['id' => $id])->delete();
            return returnResponse(true, 'SENTENCES.DELETED_SUCCESS', [], 200, true);
        }
    }

    public function getAllCurrency(Request $request){
        $record = Currencies::orderBy('id', 'DESC');
        if (!empty($request->search) ){
          $record->where('name', 'ILIKE', '%' . $request->search . '%')
          ->orWhere('code', 'ILIKE', '%'.$request->search.'%');
      }
      $record =  $record->paginate($request->size ?? 10);

        return returnResponse(true,"Record get Successfully",$record);
    }


    public function getTenantsCurrencies()
    {

        $user = Auth::user();

        $wallets = Wallets::with(['currency'])
            ->where('owner_id', $user->id)
            ->where('owner_type', ADMIN_TYPE)
            ->get();

        if ($wallets) {

            return returnResponse(true, "Record get Successfully", $wallets);
        } else {
            return returnResponse(true, 'SENTENCES.NOT_FOUND', []);
        }
    }

    public function markPrimary($id)
    {
        if (!$currency = Currencies::where('id', $id)->first()) {
            return returnResponse(false, 'SENTENCES.NOT_FOUND', []);
        }

        $currencies = Currencies::all();

        foreach ($currencies as $c) {
            $c->exchange_rate = $c->exchange_rate / $currency->exchange_rate;
            $c->primary = false;
            $c->save();
        }

        $currency->primary = true;
        $currency->save();

        return returnResponse(true, 'SENTENCES.UPDATED_SUCCESS', [], 200, true);
    }
}
