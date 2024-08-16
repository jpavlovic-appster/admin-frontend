<?php

namespace App\Services;

use Elasticsearch\ClientBuilder;

class PlayerReportService
{

    public static function fetchResult($params)
    {
        $obj = new self();

        $body = [
            'query' => $obj->queryKey($params),
            'sort' => $obj->sortKey($params['sortBy'], $params['sortOrder']),
            'timeout' => '11s',
            'size' => $params['limit'],
            'from' => $params['offset']??0,
            'track_total_hits' => true,
            'aggs' => [
                'total_bet_count' => $obj->totalBetCountKey(),
                'currencies' => $obj->currencyKey(),
            ]
        ];

        $params = [
            'index' => ELASTICSEARCH_INDEX['users'],
            'body' => $body
        ];
        $client = ClientBuilder::create()->build();
        $return = $client->search($params);
/*


PUT users/_settings
{
  "max_result_window" : 500000
}




*/




        return $return;
    }


    private function queryKey($params)
    {
        $mustArry=[];
        $filter=[];

        if($params['tenant_id']!='')
        $filter []= ['term' => ['tenant_id' => ['value' => $params['tenant_id']]]];

        if($params['parent_id']!='')
        $filter []= ['term' => ['parent_chain_ids' => ['value' => $params['parent_id']]]];

        $must=['match_all' => new \stdClass];

        if($params['currency'])
        $mustArry=['match' => ["currency"=>$params['currency'] ]];


        $query = [
            'bool' => [
                'must' => count($mustArry)?$mustArry:$must,
                'filter' => $filter
            ]
        ];

        return $query;
    }

    private function sortKey($sortBy, $sortOrder = 'ASC')
    {
        return [$sortBy => $sortOrder];
    }

    private function totalBetCountKey()
    {
        return ['sum' => ['field' => 'total_bets']];
    }

    private function currencyKey()
    {

        $currencies = [
            'terms' => ['field' => 'currency.keyword', 'size' => 10000],
            'aggs' => ['total_balance' => $this->totalBalanceKey()]
        ];
        return $currencies;

    }

    private function totalBalanceKey()
    {
        return ['sum' => ['script' => 'doc[\'real_balance\'].value + doc[\'non_cash_balance\'].value']];
    }
}
