<?php

namespace App\Services\Feeder;

use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Response;
use Illuminate\Support\Facades\DB;
use App\Models\League;
use App\Models\Sport;

class LeagueService
{
  protected $dbFeeder;


    public function __construct(){
      $this->dbFeeder = DB::connection('pgsql_feeder');
    }


    public function upsertLeaguesData($id=0) {
      if($id == 0) {
        $id = DB::table((new League)->getTable())->max('id');
      }

      $this->getFeederLeagues($id || 0);
    }

    private function getAllowedSports() {
      $result =  DB::table((new Sport)->getTable())->select(['id'])->where('deleted_at', null)->get()->toArray();

      $data = array_map(function($e) {return is_object($e) ? $e->id : $e['id']; }, $result);

      return $data;

    }

    private function getFeederLeagues($id) {

      $sport_ids = $this->getAllowedSports();

      $this->dbFeeder->table('pulls_leagues as L')
      ->select(['L.id', 'L.created_at', 'L.updated_at', 'L.is_deleted', 'L.league_id', 'L.season', 'L.location_id', 'L.sport_id', 'L.name_en'])
          ->where('L.id','>=', $id)
          ->whereIn('L.sport_id', $sport_ids)
          ->orderBy('L.id')
          ->chunk(500, function ($val) {
              if(count($val) > 0 )
                $this->processChunckData($val);
          });
    }

    private function processChunckData($data) {
      $final_arry= [];
      $datetime = date('c');
      foreach($data as $val) {
        $final_arry[] = [
          'id'          => $val->id,
          'created'     => $datetime,
          'modified'    => $datetime,
          'is_deleted'  => $val->is_deleted,
          'sport_id'    => $val->sport_id,
          'name_en'     => $val->name_en,
          'league_id'   => $val->league_id,
          'season'      => $val->season,
          'location_id' => $val->location_id
        ];
      }

      $this->upsertData($final_arry);
    }


    private function upsertData($data) {
      DB::table((new League)->getTable())->upsert($data, ['id'], ['name_en','sport_id', 'league_id', 'season', 'location_id']);
    }
}
