<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Currencies extends Model
{
    use HasFactory;
    /**
     * @var array
     */

    // protected $table = "multi_tenant_system.crm_templates";
    protected $table = "public.currencies";

    protected $fillable = [
        'name',
        'code',
        'primary',
        'exchange_rate',
        'symbol'
    ];

    public static function getList($limit,$offset,$filter){
        $that=new self();

        $whereStr='';

        if($offset==1){
            $offset=0;
        }

        $record = DB::table($that->table,'p')
            ->select(['id','first_name','last_name','email','phone','phone_verified','parent_id',
                'tenant_id','agent_name','active','deactivated_by_id','deactivated_at','deactivated_by_type',
                'created_at','updated_at','confirmed_at','confirmation_sent_at','unconfirmed_email']);

     /*   if(@$filter['email']!=''){
            $whereStr =" p.email like '%".$filter['email']."%'";
            $record->WhereRaw($whereStr);
        }
        if(@$filter['first_name']!=''){
            $whereStr =" p.first_name like '%".$filter['first_name']."%'";
            $record->WhereRaw($whereStr);
        }
        if(@$filter['last_name']!=''){
            $whereStr =" p.last_name like '%".$filter['last_name']."%'";
            $record->WhereRaw($whereStr);
        }
        if(@$filter['phone']!=''){
            $whereStr =" p.phone like '%".$filter['phone']."%'";
            $record->WhereRaw($whereStr);
        }
        if(@$filter['active']!=''){
            $whereStr =" p.active = '".$filter['active']."'";
            $record->WhereRaw($whereStr);
        }
        if(@$filter['agent_name']!=''){
            $whereStr =" p.agent_name like '%".$filter['agent_name']."%'";
            $record->WhereRaw($whereStr);
        }
        if(@$filter['tenant_id']!=''){
            $whereStr =" p.tenant_id = '".$filter['tenant_id']."'";
            $record->WhereRaw($whereStr);
        }
        if(@$filter['parent_id']!=''){
            $whereStr =" p.parent_id = '".$filter['parent_id']."'";
            $record->WhereRaw($whereStr);
        }*/

        $count=$record->count();
        $result=$record->orderByDesc('id')->forPage($offset,$limit)->get();

        return ['data'=>$result,'count'=>@$count];
    }
}
