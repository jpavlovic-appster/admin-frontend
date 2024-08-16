<?php

namespace App\Services\Feeder;

use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Response;
use Illuminate\Support\Facades\DB;
use App\Models\EventParticipant;
use App\Models\Event;

class EventParticipantService
{
  protected $dbFeeder;

    public function __construct(){
      $this->dbFeeder = DB::connection('pgsql_feeder');
    }

    // public function upsertEventParticipantData($id=0)
    // {
    //   $this->getFeederEventParticipants($id);
    // }

    private function getFeederEventParticipants($id) {
      $this->dbFeeder->table('pulls_eventparticipants')->select(['id', 'created_at', 'is_deleted', 'position', 'rotation_id', 'is_active', 'extra_data', 'event_id', 'participant_id'])
          ->where('id','>=', $id)
          ->chunkById(500, function ($events) {
              if(count($events) > 0 )
                $this->processChunckData($events);
          });
    }

    private function validateEventIds($data) {
      $eventIds = DB::table((new Event)->getTable())->select(['id'])->whereIn('id', $data)->get()->pluck('id');
      return $eventIds->toArray();
    }

    private function processChunckData($data) {

      $upsertArry = $this->validateEventIds($data->pluck('event_id'));

      $final_arry= [];
      $datetime = date('c');
      foreach($data as $val) {

        if(in_array($val->event_id, $upsertArry)) {
          $final_arry[] = [
            'id'             => $val->id,
            'created_at'     => $datetime,
            'updated_at'     => $datetime,
            'is_deleted'     => $val->is_deleted,
            'position'       => $val->position,
            'rotation_id'    => $val->rotation_id,
            'is_active'      => $val->is_active,
            'extra_data'     => $val->extra_data,
            'event_id'       => $val->event_id,
            'participant_id' => $val->participant_id
          ];
        }
      }

      if(count($final_arry) > 0){
        $this->upsertData($final_arry);
      }
    }

    private function upsertData($data) {
      DB::table((new EventParticipant)->getTable())->upsert($data, ['event_id', 'participant_id'], ['rotation_id', 'extra_data', 'is_active']);
    }
}
