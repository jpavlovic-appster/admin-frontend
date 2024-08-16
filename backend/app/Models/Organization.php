<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Model;
use App\Models\SubscriberSystem\Subscriber;

class Organization extends Model
{
  use HasFactory;
  use SoftDeletes;
  protected $table="organizations";

  protected $fillable=[
      'name',
      'status',
  ];

  protected static function boot()
  {
      parent::boot();

      self::deleting(function ($org) {
        $org->subscribers()->each(function($subscriber) {
          $subscriber->delete(); // <-- direct deletion
       });
    });
  }

  public function subscribers()
    {
      return $this->hasMany(Subscriber::class,'organization_id', 'id');
    } 
}
