<?php

namespace App\Services\Feeder;

use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Response;
use Illuminate\Support\Facades\DB;
use App\Models\Event;
use App\Models\Sport;

class EventService
{
  protected $dbFeeder;

    public function __construct(){
      $this->dbFeeder = DB::connection('pgsql_feeder');
    }


    public function upsertEventData($id=0)
    {
      if($id == 0) {
        $id = DB::table((new Event)->getTable())->max('id');
      }

      $this->getFeederEvents($id || 0);

    }

    private function getAllowedSports() {
      $result =  DB::table((new Sport)->getTable())->select(['id'])->where('deleted_at', null)->get()->toArray();

      $data = array_map(function($e) {return is_object($e) ? $e->id : $e['id']; }, $result);

      return $data;

    }

    private function getFeederEvents($id) {

      $sport_ids = $this->getAllowedSports();

      $this->dbFeeder->table('pulls_events')->select(['id', 'created_at', 'is_deleted', 'fixture_id', 'fixture_status', 'start_date', 'last_update', 'league_id', 'location_id', 'sport_id', 'livescore', 'market', 'league_name_en', 'sport_name_en', 'is_event_blacklisted', 'location_name_en'])
          ->where('id','>=', $id)
          ->whereIn('sport_id', $sport_ids)
          ->where('start_date', '>', '2022-03-31')
          ->chunkById(500, function ($events) {
              if(count($events) > 0 )
                $this->processChunckData($events);

          });
    }

    private function processChunckData($data) {
      $final_arry= [];
      $datetime = date('c');
      foreach($data as $val) {
        $final_arry[] = [
          'id' => $val->id,
          'created'              => $datetime,
          'modified' => $datetime,
          'is_deleted'           =>  $val->is_deleted,
          'fixture_id'           => $val->fixture_id,
          'fixture_status'       => $val->fixture_status,
          'start_date'           => $val->start_date,
          'last_update'          => $val->last_update,
          'league_id'            => $val->league_id,
          'location_id'          => $val->location_id,
          'sport_id'             => $val->sport_id,
          'livescore'            => $val->livescore,
          'market'               =>  $val->market,
          'league_name_en'       => $val->league_name_en,
          'sport_name_en'        => $val->sport_name_en,
          'is_event_blacklisted' => $val->is_event_blacklisted,
          'location_name_en'     => $val->location_name_en
        ];
      }

      $this->upsertData($final_arry);
    }


    private function upsertData($data) {
      DB::table((new Event)->getTable())->upsert($data, ['fixture_id'], ['fixture_status', 'start_date', 'livescore', 'market']);
    }
}
