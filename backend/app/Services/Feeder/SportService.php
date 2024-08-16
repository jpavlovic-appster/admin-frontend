<?php

namespace App\Services\Feeder;

use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Response;
use Illuminate\Support\Facades\DB;
use App\Models\Sport;

class SportService
{
  protected $dbFeeder;

  protected $allowedSports = [48242, 154919, 6046, 35232, 54094, 154830, 131506, 1149093, 154914, 452674, 687887, 687889, 35709, 530129, 274792, 265917, 687890, 388764, 1149097, 687897, 1149100, 307126, 46957, 1149104, 1149107, 1149122, 1149117 ];

    public function __construct(){
      $this->dbFeeder = DB::connection('pgsql_feeder');
    }


    public function upsertSportsData($id=0){
      $this->getFeederSports($id);
    }

    private function getFeederSports($id) {
      $this->dbFeeder->table('pulls_sports')->select(['id', 'sport_id', 'name_en', 'is_deleted'])
          ->where('id','>=', $id)
          ->whereIn('sport_id', $this->allowedSports)
          ->chunkById(500, function ($val) {
              if(count($val) > 0 )
                $this->processChunckData($val);

          });
    }

    private function processChunckData($data) {
      $final_arry= [];
      $datetime = date('c');
      foreach($data as $val) {
        $final_arry[] = [
          'id'             => $val->id,
          'created'        => $datetime,
          'modified'       => $datetime,
          'is_deleted'     => $val->is_deleted,
          'sport_id'       => $val->sport_id,
          'name_en'        => $val->name_en,
          'sport_icon_url' => $this->sportIconUrl($val->sport_id)
        ];
      }

      $this->upsertData($final_arry);
    }

    private function sportIconUrl($sport_id) {
      $url = "https://fantastic-gaming-s3.s3.amazonaws.com/assets/sports-icon/{$sport_id}.svg";
      $default_url = 'https://fantastic-gaming-s3.s3.amazonaws.com/assets/sports-icon/0.svg';
      return @file_get_contents($url)? $url : $default_url;
    }


    private function upsertData($data) {
      DB::table((new Sport)->getTable())->upsert($data, ['id'], ['name_en','sport_id', 'sport_icon_url']);
    }
}
