<?php

namespace App\Http\Controllers\Api\Reports;

use App\Exports\BetReportExport;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use App\Models\CrashGame\Bets;
use App\Models\Organization;
use App\Models\SubscriberSystem\Subscriber;
use App\Models\SubscriberSystem\SubscriberAdmin;
use App\Models\SubscriberSystem\User as SubscriberUser;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;
use Maatwebsite\Excel\Facades\Excel;

class BetReportController extends Controller
{
  public function report()
  {

    $data = [
      [
        "bet_id" => "",
        "created_at" => "",
        "user" => "",
        "tournament" => "",
        "match" => "",
        "stake" => "",
        "odds" => "",
        "market" => "",
        "status" => "",
        "winning" => "",
      ]
    ];

    return returnResponse(true, "Records Found Successfully", ['data' => $data, 'total' => 0]);
  }
  public function getBetReports(Request $request)
  {


    try {
      if ($request->tenant_id == -1) {
        $query = Bets::select(DB::raw('online_game_system.crash_game_bets.*,o.name as organization_name,c.subscriber_name'))
          ->join((new SubscriberUser())->getTable() . ' as s', 's.id', '=', 'online_game_system.crash_game_bets.user_id')
          ->join((new Subscriber())->getTable() . ' as c', 'c.id', '=', 's.subscriber_id')
          ->join((new Organization())->getTable() . ' as o', 'o.id', '=', 'c.organization_id')
          ->where('o.id', $request->organization);
      } else {
        $sub = explode(",", $request->tenant_id);
        $query = Bets::select(DB::raw('online_game_system.crash_game_bets.*,o.name as organization_name,c.subscriber_name'))
          ->join((new SubscriberUser())->getTable() . ' as s', 's.id', '=', 'online_game_system.crash_game_bets.user_id')
          ->join((new Subscriber())->getTable() . ' as c', 'c.id', '=', 's.subscriber_id')
          ->join((new Organization())->getTable() . ' as o', 'o.id', '=', 'c.organization_id')
          ->whereIn('c.id', $sub);
      }
      if (!empty($request->search && $request->search != "null")) {
        $query = $query->where('online_game_system.crash_game_bets.id', $request->search);
      }
      if (!empty($request->result)) {
        $query = $query->where('result', $request->result);
      }
      if (!empty($request->start_date) && !empty($request->end_date)) {

        $query = $query->whereBetween('online_game_system.crash_game_bets.created_at', [$request->start_date, $request->end_date]);
      };

      if (!empty($request->winning_min_amt && $request->winning_min_amt != "null")) {
        $query = $query->where('winning_amount', '>=', $request->winning_min_amt);
      }

      if (!empty($request->winning_max_amt && $request->winning_max_amt != "null")) {
        $query = $query->where('winning_amount', '<=', $request->winning_max_amt);
      }

      $query = $query->orderBy($request->sort_by, $request->order);

      // $query = $query->with(['user.wallet.currency', 'betslip.bet.event.league', 'betslip.bet.event.sport']);

      $bet_transactions = $query->paginate($request->size ? $request->size : 10);

      return returnResponse(true, "Record get Successfully", $bet_transactions);
    } catch (\Exception $e) {
      return returnResponse(false, $e->getMessage(), [], Response::HTTP_EXPECTATION_FAILED, true);
    }
  }

  public function getSubBetReports(Request $request)
  {
    try {
      $sub = explode(",", $request->tenant_id);
      $users = SubscriberUser::select('id')->whereIn('subscriber_id', $sub)->get();
      $users = array_column($users->toArray(), 'id');
      $query =  Bets::select('*')
        ->whereIn('user_id', $users);

      if (!empty($request->search && $request->search != "null")) {
        $query = $query->where('id', $request->search);
      }

      if (!empty($request->result)) {
        $query = $query->where('result', $request->result);
      }
      if (!empty($request->start_date) && !empty($request->end_date)) {

        $query = $query->whereBetween('created_at', [$request->start_date, $request->end_date]);
      }
      if (!empty($request->winning_min_amt && $request->winning_min_amt != "null")) {
        $query = $query->where('winning_amount', '>=', $request->winning_min_amt);
      }

      if (!empty($request->winning_max_amt && $request->winning_max_amt != "null")) {
        $query = $query->where('winning_amount', '<=', $request->winning_max_amt);
      }

      $query = $query->orderBy($request->sort_by, $request->order);

      // $query = $query->with(['user.wallet.currency', 'betslip.bet.event.league', 'betslip.bet.event.sport']);

      $bet_transactions = $query->paginate($request->size ? $request->size : 10);

      return returnResponse(true, "Record get Successfully", $bet_transactions);
    } catch (\Exception $e) {
      return returnResponse(false, $e->getMessage(), [], Response::HTTP_EXPECTATION_FAILED, true);
    }
  }

  public function exportReport(Request $request)
  {
    try {
      if ($request->tenant_id == -1) {
        $query = Bets::select(DB::raw('online_game_system.crash_game_bets.id,online_game_system.crash_game_bets.user_id,o.name as organization_name,c.subscriber_name,online_game_system.crash_game_bets.auto_rate,online_game_system.crash_game_bets.escape_rate,online_game_system.crash_game_bets.bet_amount,online_game_system.crash_game_bets.winning_amount,online_game_system.crash_game_bets.result,online_game_system.crash_game_bets.currency_code,online_game_system.crash_game_bets.created_at'))
        ->join((new SubscriberUser())->getTable() . ' as s', 's.id', '=', 'online_game_system.crash_game_bets.user_id')
        ->join((new Subscriber())->getTable() . ' as c', 'c.id', '=', 's.subscriber_id')
        ->join((new Organization())->getTable() . ' as o', 'o.id', '=', 'c.organization_id')
        ->where('o.id', $request->organization);
      } else {
        $sub = explode(",", $request->tenant_id);
        $query = Bets::select(DB::raw('online_game_system.crash_game_bets.id,online_game_system.crash_game_bets.user_id,o.name as organization_name,c.subscriber_name,online_game_system.crash_game_bets.auto_rate,online_game_system.crash_game_bets.escape_rate,online_game_system.crash_game_bets.bet_amount,online_game_system.crash_game_bets.winning_amount,online_game_system.crash_game_bets.result,online_game_system.crash_game_bets.currency_code,online_game_system.crash_game_bets.created_at'))
          ->join((new SubscriberUser())->getTable() . ' as s', 's.id', '=', 'online_game_system.crash_game_bets.user_id')
          ->join((new Subscriber())->getTable() . ' as c', 'c.id', '=', 's.subscriber_id')
          ->join((new Organization())->getTable() . ' as o', 'o.id', '=', 'c.organization_id')
          ->whereIn('c.id', $sub);
      }

      if (!empty($request->search && $request->search != "null")) {
        $query = $query->where('id', $request->search);
      }

      if (!empty($request->result)) {
        $query = $query->where('result', $request->result);
      }
      if (!empty($request->start_date) && !empty($request->end_date)) {

        $query = $query->whereBetween('online_game_system.crash_game_bets.created_at', [$request->start_date, $request->end_date]);
      }
      if (!empty($request->winning_min_amt && $request->winning_min_amt != "null")) {
        $query = $query->where('winning_amount', '>=', $request->winning_min_amt);
      }

      if (!empty($request->winning_max_amt && $request->winning_max_amt != "null")) {
        $query = $query->where('winning_amount', '<=', $request->winning_max_amt);
      }


      // $query = $query->with(['user.wallet.currency', 'betslip.bet.event.league', 'betslip.bet.event.sport']);

      $bet_transactions = $query->orderBy('created_at', 'DESC')->get();
      return Excel::download(new BetReportExport($bet_transactions), 'Bet-report' . Carbon::now() . '.csv');
    } catch (\Exception $e) {
      return returnResponse(false, $e->getMessage(), [], Response::HTTP_EXPECTATION_FAILED, true);
    }
  }
}
