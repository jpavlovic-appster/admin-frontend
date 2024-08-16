<?php

namespace App\Services\Feeder;

use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Response;
use Illuminate\Support\Facades\DB;
use App\Models\Participant;

class ParticipantService
{
  protected $dbFeeder;

    public function __construct(){
      $this->dbFeeder = DB::connection('pgsql_feeder');
    }

    public function upsertParticipantData($id=0)
    {
      if($id == 0) {
        $id = DB::table((new Participant)->getTable())->max('id');
      }
      $this->getFeederParticipants($id || 0);

    }

    private function getFeederParticipants($id) {
      $this->dbFeeder->table('pulls_participants')->select(['id', 'created_at', 'is_deleted', 'participant_id', 'name_en'])
          ->where('id','>=', $id)
          ->chunkById(500, function ($values) {
              if(count($values) > 0 )
                $this->processChunckData($values);

          });
    }

    private function processChunckData($data) {
      $final_arry= [];
      $datetime = date('c');
      foreach($data as $val) {
        $final_arry[] = [
          'id'             => $val->id,
          'created_at'     => $datetime,
          'updated_at'     => $datetime,
          'is_deleted'     => $val->is_deleted,
          'participant_id' => $val->participant_id,
          'name_en' => $val->name_en
        ];
      }

      $this->upsertData($final_arry);
    }


    private function upsertData($data) {
      DB::table((new Participant)->getTable())->upsert($data, ['id'], ['participant_id', 'name_en']);
    }
}
