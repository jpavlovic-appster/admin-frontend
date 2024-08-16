<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Support\Facades\DB;

use Elasticsearch\ClientBuilder;

class TestController extends Controller
{
    //

  public function testing() {

    // $userId = random_int(50, 99999);
    $userId = 3508;


     $data = array(
        'doc' => array(
          'player_id' => $userId,
          'testData' => uniqid().' sfsdfs ',
          ),
        'doc_as_upsert'=> true
      );


        $params = [
            'body' => $data,
            'index' => ELASTICSEARCH_INDEX['users'],
            'id' => $userId,
        ];



        $client = ClientBuilder::create()->build();
        $return = $client->update($params);


        // echo '<pre>';
        dd($data);


  }
}
