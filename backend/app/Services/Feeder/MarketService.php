<?php

namespace App\Services\Feeder;

use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Response;
use Illuminate\Support\Facades\DB;
use App\Models\Market;

class MarketService
{
  protected $dbFeeder;


    public function __construct(){
      $this->dbFeeder = DB::connection('pgsql_feeder');
    }


    public function upsertMarketData($id=0)
    {
      if($id == 0) {
        $id = DB::table((new Market)->getTable())->max('id');
      }
      $this->getFeederMarkets($id || 0);
    }

    private function getFeederMarkets($id) {
      $this->dbFeeder->table('pulls_markets')
      ->select(['id', 'created_at', 'updated_at', 'is_deleted', 'market_id', 'name_en'])
          ->where('id','>=', $id)
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
          'market_id' => $val->market_id
        ];
      }

      $this->upsertData($final_arry);
    }


    private function upsertData($data) {
      DB::table((new Market)->getTable())->upsert($data, ['id'], ['name_en', 'market_id']);
    }
}
