<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Betslip;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Http\Response;
use App\Models\CrashGame\User as CrashGameUser;
use App\Models\SubscriberSystem\User as SubscriberUser;
use App\Models\CrashGame\Bets;
use App\Models\OnlineGameSystem\FreeBets;
use App\Models\Wallets;
use App\Models\User;
use Validator;
use Illuminate\Support\Facades\Auth;
use App\Imports\FreeBetImport;
use App\Models\OnlineGameSystem\FreeBetRain;
use Maatwebsite\Excel\Facades\Excel;

class CrashGameController extends Controller
{
  public function index(Request $request)
  {
    try {

      $betslis = DB::table((new Bets)->getTable() . ' as bs')->select([
        'bs.id as id', 'auto_rate', 'escape_rate', 'bet_amount', 'bs.created_at as bs_created_at', 'bs.winning_amount as wa'

      ])->join((new CrashGameUser)->getTable() . ' as sbu', 'bs.user_id', '=', 'sbu.user_id');

      if ($request->type == "subscriber") {
        $betslis = $betslis->addSelect(['u.user_code', 'u.currency_code', 'u.id as user_id'])
          ->join((new SubscriberUser)->getTable() . ' as u', 'sbu.subscriber_user_id', '=', 'u.id')
          ->where('u.subscriber_id', $request->subscriber_id);
      } else if ($request->type == 'tenant') {
        $betslis = $betslis->addSelect(['email', 'tenant_id', 'w.currency_code', 'u.id as user_id'])
          ->join((new User)->getTable() . ' as u', 'sbu.tenant_user_id', '=', 'u.id')
          ->join((new Wallets)->getTable() . ' as w', 'u.id', '=', 'w.owner_id')
          ->where('w.owner_type', USER_TYPE)
          ->where('u.tenant_id', $request->tenant_id);
      }



      if (!empty($request->currency_code) && $request->type == "tenant") {
        $betslis = $betslis->where('w.currency_code', $request->currency_code);
      }

      if (!empty($request->search) && $request->type == "tenant") {
        $betslis = $betslis->where("u.email", 'ilike', '%' . $request->search . '%');
      }

      if (!empty($request->start_date) && !empty($request->end_date)) {
        $startDate = Carbon::parse($request->start_date . '00:00:00')->toDateTimeString();
        $endDate = Carbon::parse($request->end_date . ' 23:59:59')->toDateTimeString();
        $betslis = $betslis->whereBetween("bs.created_at", [$startDate, $endDate]);
      }

      $betslis = $betslis->orderBy('bs.updated_at', 'DESC')->paginate($request->size ?? 10);

      return returnResponse(true, '', $betslis, Response::HTTP_OK, true);
    } catch (\Exception $e) {
      return returnResponse(false, $e->getMessage(), [], Response::HTTP_BAD_REQUEST, true);
    }
  }

  public function showBets(Request $request)
  {
    $bet = Bets::where('user_id', $request->user_id);
    $user = SubscriberUser::where('id', $request->user_id)->get();

    if (!empty($request->freebet)) {
      $bet = $bet->where('is_free_bet', $request->freebet);
    }

    if (!empty($request->autobet)) {
      $bet = $bet->where('is_auto_bet', $request->autobet);
    }

    if (!empty($request->result)) {
      $bet = $bet->where('result', $request->result);
    }

    if (!empty($request->start_date) && !empty($request->end_date)) {
      $startDate = Carbon::parse($request->start_date . '00:00:00')->toDateTimeString();
      $endDate = Carbon::parse($request->end_date . ' 23:59:59')->toDateTimeString();
      $bet = $bet->whereBetween("created_at", [$startDate, $endDate]);
    }



    $bet = $bet->orderBy($request->sort_by, $request->order)->paginate($request->size ?? 10);

    $record = [
      'bet' => $bet,
      'user' => $user
    ];
    return returnResponse(true, "Record get Successfully", $record);
  }

  public function createFreeBet(Request $request)
  {
    $user = SubscriberUser::where('subscriber_id', $request->sub_id)
      ->where('id', $request->user_id)
      ->first();

    if (!$user) {
      return returnResponse(false, 'No user found with this id', [], Response::HTTP_BAD_REQUEST);
    }
    // $free =  FreeBets::where('user_id', $request->user_id)->first();
    // if ($free)
    //   return returnResponse(false, 'Free Bet already allotted to this user', [], Response::HTTP_BAD_REQUEST);

    $messages = [
      'user_id.required' => 'VALIDATION_MSGS.USER_ID.REQUIRED',
      'currency.required' => 'VALIDATION_MSGS.CURRENCY.REQUIRED',
      'bet_amount.required' => 'VALIDATION_MSGS.BET_AMOUNT.REQUIRED',
      'num_free_bets.required' => 'VALIDATION_MSGS.NUMBER_OF_FREE_BETS.REQUIRED',
      'end_date.required' => 'VALIDATION_MSGS.END_DATE.REQUIRED'
    ];

    $validation = Validator::make($request->all(), [
      'user_id' => 'required',
      'currency' => 'required',
      'bet_amount' => 'required',
      'num_free_bets' => 'required',
      'end_date' => 'required',
    ], $messages);

    if ($validation->fails()) {
      return returnResponse(false, '', $validation->errors(), Response::HTTP_BAD_REQUEST);
    }

    $free_bet = new FreeBets;
    $free_bet->subscriber_id = $request->sub_id;
    $free_bet->user_id = $request->user_id;
    $free_bet->currency_code = $request->currency;
    $free_bet->bet_amount = $request->bet_amount;
    $free_bet->num_of_free_bets = $request->num_free_bets;
    $free_bet->end_date = Carbon::createFromFormat('Y-m-d', $request->end_date)->format('Y-m-d 23:59');
    $free_bet->save();

    return returnResponse(true, 'SENTENCES.CREATED_SUCCESS', [], Response::HTTP_OK, true);
  }

  public function getFreeBet(Request $request)
  {
    $free = FreeBets::where('subscriber_id', $request->subscriber_id);

    if (!$free) {
      return returnResponse(false, 'SENTENCES.NOT_FOUND', [], 404);
    }
    $record = $free->orderBy($request->sort_by, $request->order)->paginate($request->size ?? 10);

    $custom = collect(['count' => $record->total()]);

    $data = $custom->merge($record);
    return returnResponse(true, 'Free Bets Found', $data, Response::HTTP_OK, true);
  }

  public function deleteFreeBet($id)
  {
    $freeBet = FreeBets::where('id', $id)->first();
    if (!$freeBet) {
      return returnResponse(false, 'record Not found', [], Response::HTTP_NOT_FOUND, true);
    } else {

      FreeBets::where(['id' => $id])->delete();
      return returnResponse(true, 'deleted successfully.', [], Response::HTTP_OK, true);
    }
  }

  public function showFreeBet($id)
  {

    $freeBet = FreeBets::find($id);
    return returnResponse(true, "Record get Successfully", $freeBet);
  }

  public function updateFreeBet(Request $request)
  {

    $messages = array(
      'user_id.required' => 'VALIDATION_MSGS.USER_ID.REQUIRED',
      'currency.required' => 'VALIDATION_MSGS.CURRENCY.REQUIRED',
      'bet_amount.required' => 'VALIDATION_MSGS.BET_AMOUNT.REQUIRED',
      'num_free_bets.required' => 'VALIDATION_MSGS.NUMBER_OF_FREE_BETS.REQUIRED',
      'end_date.required' => 'VALIDATION_MSGS.END_DATE.REQUIRED'
    );

    $validator = Validator::make($request->all(), [
      'user_id' => 'required',
      'currency' => 'required',
      'bet_amount' => 'required',
      'num_free_bets' => 'required',
      'end_date' => 'required',
    ], $messages);

    if ($validator->fails()) {
      return returnResponse(false, '', $validator->errors(), Response::HTTP_BAD_REQUEST);
    }

    $freeBet = FreeBets::find($request->id);

    if (empty($freeBet)) {
      return returnResponse(true, 'SENTENCES.NOT_FOUND', [], 404, true);
    }

    $insertData = [
      'user_id' => $request->user_id,
      'currency_code' => $request->currency,
      'bet_amount' => $request->bet_amount,
      'num_of_free_bets' => $request->num_free_bets,
      'end_date' => Carbon::createFromFormat('Y-m-d', $request->end_date)->format('Y-m-d 23:59'),
    ];

    $freeBet->update($insertData);


    return returnResponse(true, 'SENTENCES.UPDATED_SUCCESS', [], Response::HTTP_OK, true);
  }

  public function bulkUpload(Request $request)
  {

    Excel::import(new FreeBetImport, request()->file('file'));
  }

  public function createFreeBetRain(Request $request)
  {
    $messages = [
      'sub_id.required' => 'VALIDATION_MSGS.SUBSCRIBER_ID.REQUIRED',
      'currency.required' => 'VALIDATION_MSGS.CURRENCY.REQUIRED',
      'bet_amount.required' => 'VALIDATION_MSGS.BET_AMOUNT.REQUIRED',
      'num_free_bets.required' => 'VALIDATION_MSGS.NUMBER_OF_FREE_BETS.REQUIRED',
      'start_time.required' => 'VALIDATION_MSGS.START_TIME.REQUIRED',
      'end_time.required' => 'VALIDATION_MSGS.END_TIME.REQUIRED',
      'rain_start_time.required' => 'VALIDATION_MSGS.RAIN_START_TIME.REQUIRED',
      'rain_end_time.required' => 'VALIDATION_MSGS.RAIN_END_TIME.REQUIRED',
      'minimum_multiplier.required' => 'VALIDATION_MSGS.MINIMUM_MULTIPLIER.REQUIRED',
      'expiry_after_claim.required' => 'VALIDATION_MSGS.EXPIRY_AFTER_CLAIM.REQUIRED',
      'promotion_name.required' => 'VALIDATION_MSGS.promotion_name.REQUIRED',
      'check_bet_time_before_claim.required' => 'VALIDATION_MSGS.check_bet_time_before_claim.REQUIRED',
      'check_bet_amount_before_claim.required' => 'VALIDATION_MSGS.check_bet_amount_before_claim.REQUIRED',
    ];

    $validation = Validator::make($request->all(), [
      'sub_id' => 'required',
      'currency' => 'required',
      'bet_amount' => 'required',
      'num_free_bets' => 'required',
      'start_time' => 'required',
      'end_time' => 'required',
      'rain_start_time' => 'required',
      'rain_end_time' => 'required',
      'minimum_multiplier' => 'required',
      'expiry_after_claim' => 'required',
      'promotion_name' => 'required',
      'check_bet_time_before_claim' => 'required',
      'check_bet_amount_before_claim' => 'required'
    ], $messages);

    if ($validation->fails()) {
      return returnResponse(false, '', $validation->errors(), Response::HTTP_BAD_REQUEST);
    }
    $start_time = date_create($request->start_time);
    $end_time = date_create($request->end_time);
    $start_time = date_format($start_time, "Y-m-d H:i:s");
    $end_time = date_format($end_time, "Y-m-d H:i:s");
    $rain_start_time = date_create($request->rain_start_time);
    $rain_end_time = date_create($request->rain_end_time);
    $rain_start_time = date_format($rain_start_time, "Y-m-d H:i:s");
    $rain_end_time = date_format($rain_end_time, "Y-m-d H:i:s");

    $free = FreeBetRain::where('subscriber_id', $request->sub_id)
    ->where('currency_code',$request->currency);
    $start_time_check = clone $free;
    $check_time = clone $free;

    $check_time = $check_time->whereDate('start_time', '>=', $start_time)
    ->whereDate('end_time', '<=', $end_time)->get();

    $start_time_check = $start_time_check->whereDate('start_time', '<=', $start_time)
    ->whereDate('end_time', '>=', $start_time)->get();

    $free = $free->whereDate('start_time', '<=', $end_time)
    ->whereDate('end_time', '>=', $end_time)->get();
   
    if (!$free->isEmpty() || !$start_time_check->isEmpty() || !$check_time->isEmpty() )
      return returnResponse(false, 'Already have free bet rain in this time window', [],  Response::HTTP_BAD_REQUEST, true);
    $free_bet = new FreeBetRain;
    $free_bet->subscriber_id = $request->sub_id;
    $free_bet->currency_code = $request->currency;
    $free_bet->bet_amount = $request->bet_amount;
    $free_bet->num_of_free_bets = $request->num_free_bets;
    $free_bet->start_time = $start_time;
    $free_bet->end_time = $end_time;
    $free_bet->rain_start_time = $rain_start_time;
    $free_bet->rain_end_time = $rain_end_time;
    $free_bet->minimum_multiplier = $request->minimum_multiplier;
    $free_bet->expiry_after_claim = $request->expiry_after_claim;
    $free_bet->promotion_name = $request->promotion_name;
    $free_bet->check_bet_time_before_claim_in_minutes = $request->check_bet_time_before_claim;
    $free_bet->check_bet_amount_before_claim = $request->check_bet_amount_before_claim;
    $free_bet->save();
    return returnResponse(true, 'SENTENCES.CREATED_SUCCESS', [], Response::HTTP_OK, true);
  }

  public function getFreeBetRain(Request $request)
  {
    $free = FreeBetRain::where('subscriber_id', $request->subscriber_id);

    if (!$free) {
      return returnResponse(false, 'SENTENCES.NOT_FOUND', [], 404);
    }
    $record = $free->orderBy($request->sort_by, $request->order)->paginate($request->size ?? 10);

    $custom = collect(['count' => $record->total()]);

    $data = $custom->merge($record);
    return returnResponse(true, 'Free Bet Rains Found', $data, Response::HTTP_OK, true);
  }

  public function showFreeBetRain($id)
  {
    $freeBet = FreeBetRain::find($id);
    return returnResponse(true, "Record get Successfully", $freeBet);
  }

  public function updateFreeBetRain(Request $request)
  {
    $messages = array(
      'currency.required' => 'VALIDATION_MSGS.CURRENCY.REQUIRED',
      'bet_amount.required' => 'VALIDATION_MSGS.BET_AMOUNT.REQUIRED',
      'num_free_bets.required' => 'VALIDATION_MSGS.NUMBER_OF_FREE_BETS.REQUIRED',
      'start_time.required' => 'VALIDATION_MSGS.START_TIME.REQUIRED',
      'end_time.required' => 'VALIDATION_MSGS.END_TIME.REQUIRED',
      'rain_start_time.required' => 'VALIDATION_MSGS.RAIN_START_TIME.REQUIRED',
      'rain_end_time.required' => 'VALIDATION_MSGS.RAIN_END_TIME.REQUIRED',
      'minimum_multiplier.required' => 'VALIDATION_MSGS.MINIMUM_MULTIPLIER.REQUIRED',
      'expiry_after_claim.required' => 'VALIDATION_MSGS.EXPIRY_AFTER_CLAIM.REQUIRED',
      'promotion_name.required' => 'VALIDATION_MSGS.promotion_name.REQUIRED',
      'check_bet_time_before_claim.required' => 'VALIDATION_MSGS.check_bet_time_before_claim.REQUIRED',
      'check_bet_amount_before_claim.required' => 'VALIDATION_MSGS.check_bet_amount_before_claim.REQUIRED',
    );

    $validator = Validator::make($request->all(), [
      'currency' => 'required',
      'bet_amount' => 'required',
      'num_free_bets' => 'required',
      'start_time' => 'required',
      'end_time' => 'required',
      'rain_start_time' => 'required',
      'rain_end_time' => 'required',
      'minimum_multiplier' => 'required',
      'expiry_after_claim' => 'required',
      'promotion_name' => 'required',
      'check_bet_time_before_claim' => 'required',
      'check_bet_amount_before_claim' => 'required'
    ], $messages);

    if ($validator->fails()) {
      return returnResponse(false, '', $validator->errors(), Response::HTTP_BAD_REQUEST);
    }

    $freeBetRain = FreeBetRain::find($request->id);

    if (empty($freeBetRain)) {
      return returnResponse(true, 'SENTENCES.NOT_FOUND', [], 404, true);
    }

    if ($freeBetRain->start_time <= Carbon::now())
      return returnResponse(false, 'Cannot update free bet rain after current time passing the start time of promotion', [], Response::HTTP_BAD_REQUEST, true);

    $start_time = date_create($request->start_time);
    $end_time = date_create($request->end_time);
    $start_time = date_format($start_time, "Y-m-d H:i:s");
    $end_time = date_format($end_time, "Y-m-d H:i:s");
    $rain_start_time = date_create($request->rain_start_time);
    $rain_end_time = date_create($request->rain_end_time);
    $rain_start_time = date_format($rain_start_time, "Y-m-d H:i:s");
    $rain_end_time = date_format($rain_end_time, "Y-m-d H:i:s");

    $free = FreeBetRain::
    where('subscriber_id', $request->sub_id)
    ->where('currency_code',$request->currency)
    ->whereNotIn('id', [$request->id]);

    $start_time_check = clone $free;
    $check_time = clone $free;

    $check_time = $check_time->whereDate('start_time', '>=', $start_time)
    ->whereDate('end_time', '<=', $end_time)->get();

    $start_time_check = $start_time_check->whereDate('start_time', '<=', $start_time)
    ->whereDate('end_time', '>=', $start_time)->get();

    $free = $free->whereDate('start_time', '<=', $end_time)
    ->whereDate('end_time', '>=', $end_time)->get();
   
    if (!$free->isEmpty() || !$start_time_check->isEmpty() || !$check_time->isEmpty() )
      return returnResponse(false, 'Already have free bet rain in this time window', [],  Response::HTTP_BAD_REQUEST, true);

    $insertData = [
      'currency_code' => $request->currency,
      'bet_amount' => $request->bet_amount,
      'num_of_free_bets' => $request->num_free_bets,
      'start_time' => $request->start_time,
      'end_time' => $request->end_time,
      'rain_start_time' => $request->rain_start_time,
      'rain_end_time' => $request->rain_end_time,
      'minimum_multiplier' => $request->minimum_multiplier,
      'expiry_after_claim' => $request->expiry_after_claim,
      'promotion_name' => $request->promotion_name,
      'check_bet_time_before_claim_in_minutes' => $request->check_bet_time_before_claim,
      'check_bet_amount_before_claim' => $request->check_bet_amount_before_claim
    ];

    $freeBetRain->update($insertData);

    return returnResponse(true, 'SENTENCES.UPDATED_SUCCESS', [], Response::HTTP_OK, true);
  }

  public function deleteFreeBetRain($id)
  {
    $freeBetRain = FreeBetRain::where('id', $id)->first();
    if (!$freeBetRain) {
      return returnResponse(false, 'record Not found', [], Response::HTTP_NOT_FOUND, true);
    } else if ($freeBetRain->start_time <= Carbon::now())
      return returnResponse(false, 'Cannot delete free bet rain after current time passing the start time of promotion', [], Response::HTTP_BAD_REQUEST, true);
    else {
      FreeBetRain::where(['id' => $id])->delete();
      return returnResponse(true, 'deleted successfully.', [], Response::HTTP_OK, true);
    }
  }
}
