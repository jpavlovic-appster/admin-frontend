<?php

namespace App\Services\Feeder;

use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Response;
use Illuminate\Support\Facades\DB;
use App\Models\Location;

class LocationService
{
  protected $dbFeeder;


    public function __construct(){
      $this->dbFeeder = DB::connection('pgsql_feeder');
    }


    public function upsertLocationData($id=0) {
      if($id == 0) {
        $id = DB::table((new Location)->getTable())->max('id');
      }
      $this->getFeederLocations($id || 0);
    }

    private function getFeederLocations($id) {
      $this->dbFeeder->table('pulls_locations as L')
      ->select(['L.id', 'L.created_at', 'L.updated_at', 'L.is_deleted', 'L.location_id', 'L.name_en'])
          ->where('L.id','>=', $id)
          ->chunkById(500, function ($val) {
              if(count($val) > 0 )
                $this->processChunckData($val);

              return FALSE;

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
          'name_en'     => $val->name_en,
          'location_id' => $val->location_id
        ];
      }

      $this->upsertData($final_arry);
    }


    private function upsertData($data) {
      DB::table((new Location)->getTable())->upsert($data, ['id'], ['name_en', 'location_id']);
    }
}
