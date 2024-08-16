<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

# Models
use App\Models\Transactions;
use App\Models\User;
use App\Models\Wallets;
use App\Models\Betslip;
use App\Models\TransactionSB;
use App\Models\Dfs\TransactionDfs;
use App\Models\Dfs\DfsContest;
use App\Models\Dfs\DfsContestUserPrime;
use App\Models\Dfs\DfsLeague;
use App\Models\Dfs\DfsSeason;
use App\Models\Sport;
use App\Models\Event;
use App\Models\Bet;
use Illuminate\Support\Facades\DB;
use App\Models\BetslipUser;
use App\Models\Dfs\DfsTransaction;
use App\Models\SlotSystem\Transaction;
use App\Models\SubscriberSystem\User as SubscriberSystemUser;
use App\Models\SubscriberSystem\Subscriber;
use App\Models\CrashGame\Bets;
use App\Models\Organization;
use Carbon\Carbon;
use phpseclib3\File\ASN1\Maps\OrganizationName;

# Helpers and Libraries

class SubscriberDashboardController extends Controller
{
  public function __constuct()
  {
  }

  public function total_players(Request $request)
  {
    $players = SubscriberSystemUser::query();

    if (!empty($request->organization)) {
      $subscriberIds = Subscriber::select('id')->where('organization_id', $request->organization)->pluck('id');
      $players = $players->whereIn('subscriber_id', $subscriberIds);
    }

    if (!empty($request->player_status)) {
      $status = $request->player_status == 'Yes' ? 1 : 0;;
      $players = $players->where('status', $status);
    }
    $players = $players->count();
    return returnResponse(true, "Records Found Successfully", $players);
  }

  public function sub_total_players(Request $request)
  {
    $players = SubscriberSystemUser::query();

    if (!empty($request->subscriber_id)) {
      $players = $players->where('subscriber_id', $request->subscriber_id);
    }

    if (!empty($request->player_status)) {
      $status = $request->player_status == 'Yes' ? 1 : 0;;
      $players = $players->where('status', $status);
    }
    $players = $players->count();
    return returnResponse(true, "Records Found Successfully", $players);
  }

  public function total_org_players(Request $request)
  {
    $players = SubscriberSystemUser::select(DB::raw('subscriber_system.users.id'))
      ->join((new Subscriber())->getTable() . ' as s', 's.id', '=', 'subscriber_system.users.subscriber_id')
      ->join((new Organization())->getTable() . ' as o', 'o.id', '=', 's.organization_id')
      ->where('o.id', $request->organization);
    // $subscriber = Subscriber::select('id')->where('organization_id', $request->organization)->get();
    // $filterIDs = array_column($subscriber->toArray(), 'id');
    // $players = SubscriberSystemUser::whereIn('subscriber_id', $filterIDs);
    if (!empty($request->subscriber_id)) {
      $players = $players->where('subscriber_id', $request->subscriber_id);
    }

    if (!empty($request->player_status)) {
      $status = $request->player_status == 'Yes' ? 1 : 0;
      $players = $players->where('subscriber_system.users.status', $status);
    }
    $players = $players->count();
    return returnResponse(true, "Records Found Successfully", $players);
  }

  public function total_subscribers(Request $request)
  {
    $subscribers = Subscriber::query();
    if ($request->organization) {
      $subscribers->where('organization_id', $request->organization);
    }

    if (!empty($request->status)) {
      if ($request->status == 'Yes')
        $subscribers = $subscribers->where('status', 1);
      else
        $subscribers = $subscribers->where('status', '<>', 1);
    }
    $subscribers = $subscribers->count();
    return returnResponse(true, "Records Found Successfully", $subscribers);
  }

  public function total_org_subscribers(Request $request)
  {
    $subscribers = Subscriber::where('organization_id', $request->organization);
    if (!empty($request->status)) {
      if ($request->status == 'Yes')
        $subscribers = $subscribers->where('status', 1);
      else
        $subscribers = $subscribers->where('status', '<>', 1);
    }
    $subscribers = $subscribers->count();
    return returnResponse(true, "Records Found Successfully", $subscribers);
  }

  public function betStats(Request $request)
  {
    $bets = Bets::select(DB::raw('online_game_system.crash_game_bets.id'))
      ->join((new SubscriberSystemUser())->getTable() . ' as s', 's.id', '=', 'online_game_system.crash_game_bets.user_id')
      ->join((new Subscriber())->getTable() . ' as c', 'c.id', '=', 's.subscriber_id')
      ->join((new Organization())->getTable() . ' as o', 'o.id', '=', 'c.organization_id')
      ->where('online_game_system.crash_game_bets.currency_code', $request->currency);
    if (!empty($request->start_date) && !empty($request->end_date)) {
      $startDate = Carbon::parse($request->start_date . '00:00:00')->toDateTimeString();
      $endDate = Carbon::parse($request->end_date . ' 23:59:59')->toDateTimeString();
      $bets = $bets->whereBetween("online_game_system.crash_game_bets.created_at", [$startDate, $endDate]);
    }
    if (!empty($request->organization)) {
      $bets = $bets->where('o.id', $request->organization);
    }

    $total_sell = $bets->sum('bet_amount');

    $wins = Bets::select(DB::raw('online_game_system.crash_game_bets.id'))
      ->join((new SubscriberSystemUser())->getTable() . ' as s', 's.id', '=', 'online_game_system.crash_game_bets.user_id')
      ->join((new Subscriber())->getTable() . ' as c', 'c.id', '=', 's.subscriber_id')
      ->join((new Organization())->getTable() . ' as o', 'o.id', '=', 'c.organization_id')
      ->where('online_game_system.crash_game_bets.result', 'won')
      ->where('online_game_system.crash_game_bets.currency_code', $request->currency);
    if (!empty($request->start_date) && !empty($request->end_date)) {
      $startDate = Carbon::parse($request->start_date . '00:00:00')->toDateTimeString();
      $endDate = Carbon::parse($request->end_date . ' 23:59:59')->toDateTimeString();
      $wins = $wins->whereBetween("online_game_system.crash_game_bets.created_at", [$startDate, $endDate]);
    }
    if (!empty($request->organization)) {
      $wins = $wins->where('o.id', $request->organization);
    }

    $wins = $wins->sum('winning_amount');

    $cancels = Bets::select(DB::raw('online_game_system.crash_game_bets.id'))
      ->join((new SubscriberSystemUser())->getTable() . ' as s', 's.id', '=', 'online_game_system.crash_game_bets.user_id')
      ->join((new Subscriber())->getTable() . ' as c', 'c.id', '=', 's.subscriber_id')
      ->join((new Organization())->getTable() . ' as o', 'o.id', '=', 'c.organization_id')
      ->where('online_game_system.crash_game_bets.result', 'cancelled')
      ->where('online_game_system.crash_game_bets.currency_code', $request->currency);
    if (!empty($request->start_date) && !empty($request->end_date)) {
      $startDate = Carbon::parse($request->start_date . '00:00:00')->toDateTimeString();
      $endDate = Carbon::parse($request->end_date . ' 23:59:59')->toDateTimeString();
      $cancels = $cancels->whereBetween("online_game_system.crash_game_bets.created_at", [$startDate, $endDate]);
    }
    if (!empty($request->organization)) {
      $cancels = $cancels->where('o.id', $request->organization);
    }

    $cancelled_amount = $cancels->sum('bet_amount');

    $net_sales = $total_sell - $cancelled_amount;

    $ggr = $net_sales - $wins;

    if ($net_sales != 0) {
      $rtp = ($wins / $net_sales) * 100;
    } else {
      $rtp = 0;
    }

    $stats = [
      "bets" => $total_sell,
      "wins" => $wins,
      "cancels" => $cancelled_amount,
      "net_sales" => $net_sales,
      "ggr" => $ggr,
      "rtp" => $rtp ? $rtp : 0
    ];
    return returnResponse(true, "Records Found Successfully", $stats);
  }

  public function subscriberBetStats(Request $request)
  {
    $bets = Bets::select(DB::raw('online_game_system.crash_game_bets.id'))
      ->join((new SubscriberSystemUser())->getTable() . ' as s', 's.id', '=', 'online_game_system.crash_game_bets.user_id')
      ->join((new Subscriber())->getTable() . ' as c', 'c.id', '=', 's.subscriber_id')
      ->join((new Organization())->getTable() . ' as o', 'o.id', '=', 'c.organization_id')
      ->where('online_game_system.crash_game_bets.currency_code', $request->currency)
      ->where('c.id', $request->subscriber_id);
    if (!empty($request->start_date) && !empty($request->end_date)) {
      $startDate = Carbon::parse($request->start_date . '00:00:00')->toDateTimeString();
      $endDate = Carbon::parse($request->end_date . ' 23:59:59')->toDateTimeString();
      $bets = $bets->whereBetween("online_game_system.crash_game_bets.created_at", [$startDate, $endDate]);
    }

    $total_sell = $bets->sum('bet_amount');

    $wins = Bets::select(DB::raw('online_game_system.crash_game_bets.id'))
      ->join((new SubscriberSystemUser())->getTable() . ' as s', 's.id', '=', 'online_game_system.crash_game_bets.user_id')
      ->join((new Subscriber())->getTable() . ' as c', 'c.id', '=', 's.subscriber_id')
      ->join((new Organization())->getTable() . ' as o', 'o.id', '=', 'c.organization_id')
      ->where('online_game_system.crash_game_bets.result', 'won')
      ->where('c.id', $request->subscriber_id)
      ->where('online_game_system.crash_game_bets.currency_code', $request->currency);
    if (!empty($request->start_date) && !empty($request->end_date)) {
      $startDate = Carbon::parse($request->start_date . '00:00:00')->toDateTimeString();
      $endDate = Carbon::parse($request->end_date . ' 23:59:59')->toDateTimeString();
      $wins = $wins->whereBetween("online_game_system.crash_game_bets.created_at", [$startDate, $endDate]);
    }

    $wins = $wins->sum('winning_amount');

    $cancels = Bets::select(DB::raw('online_game_system.crash_game_bets.id'))
      ->join((new SubscriberSystemUser())->getTable() . ' as s', 's.id', '=', 'online_game_system.crash_game_bets.user_id')
      ->join((new Subscriber())->getTable() . ' as c', 'c.id', '=', 's.subscriber_id')
      ->join((new Organization())->getTable() . ' as o', 'o.id', '=', 'c.organization_id')
      ->where('online_game_system.crash_game_bets.result', 'cancelled')
      ->where('c.id', $request->subscriber_id)
      ->where('online_game_system.crash_game_bets.currency_code', $request->currency);
    if (!empty($request->start_date) && !empty($request->end_date)) {
      $startDate = Carbon::parse($request->start_date . '00:00:00')->toDateTimeString();
      $endDate = Carbon::parse($request->end_date . ' 23:59:59')->toDateTimeString();
      $cancels = $cancels->whereBetween("online_game_system.crash_game_bets.created_at", [$startDate, $endDate]);
    }

    $cancelled_amount = $cancels->sum('bet_amount');

    $net_sales = $total_sell - $cancelled_amount;

    $ggr = $net_sales - $wins;

    if ($net_sales != 0) {
      $rtp = ($wins / $net_sales) * 100;
    } else {
      $rtp = 0;
    }

    $stats = [
      "bets" => $total_sell,
      "wins" => $wins,
      "cancels" => $cancelled_amount,
      "net_sales" => $net_sales,
      "ggr" => $ggr,
      "rtp" => $rtp ? $rtp : 0
    ];
    return returnResponse(true, "Records Found Successfully", $stats);
  }

  public function orgBetStats(Request $request)
  {
    $bets = Bets::select(DB::raw('online_game_system.crash_game_bets.id'))
      ->join((new SubscriberSystemUser())->getTable() . ' as s', 's.id', '=', 'online_game_system.crash_game_bets.user_id')
      ->join((new Subscriber())->getTable() . ' as c', 'c.id', '=', 's.subscriber_id')
      ->join((new Organization())->getTable() . ' as o', 'o.id', '=', 'c.organization_id')
      ->where('o.id', $request->organization)
      ->where('online_game_system.crash_game_bets.currency_code', $request->currency);
    if (!empty($request->start_date) && !empty($request->end_date)) {
      $startDate = Carbon::parse($request->start_date . '00:00:00')->toDateTimeString();
      $endDate = Carbon::parse($request->end_date . ' 23:59:59')->toDateTimeString();
      $bets = $bets->whereBetween("online_game_system.crash_game_bets.created_at", [$startDate, $endDate]);
    }

    $total_sell = $bets->sum('bet_amount');

    $wins = Bets::select(DB::raw('online_game_system.crash_game_bets.id'))
      ->join((new SubscriberSystemUser())->getTable() . ' as s', 's.id', '=', 'online_game_system.crash_game_bets.user_id')
      ->join((new Subscriber())->getTable() . ' as c', 'c.id', '=', 's.subscriber_id')
      ->join((new Organization())->getTable() . ' as o', 'o.id', '=', 'c.organization_id')
      ->where('online_game_system.crash_game_bets.result', 'won')
      ->where('o.id', $request->organization)
      ->where('online_game_system.crash_game_bets.currency_code', $request->currency);
    if (!empty($request->start_date) && !empty($request->end_date)) {
      $startDate = Carbon::parse($request->start_date . '00:00:00')->toDateTimeString();
      $endDate = Carbon::parse($request->end_date . ' 23:59:59')->toDateTimeString();
      $wins = $wins->whereBetween("online_game_system.crash_game_bets.created_at", [$startDate, $endDate]);
    }

    $wins = $wins->sum('winning_amount');

    $cancels = Bets::select(DB::raw('online_game_system.crash_game_bets.id'))
      ->join((new SubscriberSystemUser())->getTable() . ' as s', 's.id', '=', 'online_game_system.crash_game_bets.user_id')
      ->join((new Subscriber())->getTable() . ' as c', 'c.id', '=', 's.subscriber_id')
      ->join((new Organization())->getTable() . ' as o', 'o.id', '=', 'c.organization_id')
      ->where('online_game_system.crash_game_bets.result', 'cancelled')
      ->where('o.id', $request->organization)
      ->where('online_game_system.crash_game_bets.currency_code', $request->currency);
    if (!empty($request->start_date) && !empty($request->end_date)) {
      $startDate = Carbon::parse($request->start_date . '00:00:00')->toDateTimeString();
      $endDate = Carbon::parse($request->end_date . ' 23:59:59')->toDateTimeString();
      $cancels = $cancels->whereBetween("online_game_system.crash_game_bets.created_at", [$startDate, $endDate]);
    }

    $cancelled_amount = $cancels->sum('bet_amount');

    $net_sales = $total_sell - $cancelled_amount;

    $ggr = $net_sales - $wins;

    if ($net_sales != 0) {
      $rtp = ($wins / $net_sales) * 100;
    } else {
      $rtp = 0;
    }

    $stats = [
      "bets" => $total_sell,
      "wins" => $wins,
      "cancels" => $cancelled_amount,
      "net_sales" => $net_sales,
      "ggr" => $ggr,
      "rtp" => $rtp ? $rtp : 0
    ];
    return returnResponse(true, "Records Found Successfully", $stats);
  }
}
