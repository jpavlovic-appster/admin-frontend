<?php

namespace App\Models\SubscriberSystem;

use App\Models\CrashGame\Bets;
use App\Models\OnlineGameSystem\CrashGameSettings;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Model;
use App\Models\SportsBetSetting;
use App\Models\TenantCredentials;
use App\Models\TenantConfigurations;
use App\Models\SubscriberSystem\User;


class Subscriber extends Model {

    use HasFactory;
    use SoftDeletes;
    protected $table="subscriber_system.subscribers";
    public $timestamps = false;

    protected $fillable = [
        'name',
        'domain',
        'language',
        'organization_id',
        'subscriber_name',
        'status',
        'auth',
        'debit',
        'credit',
        'rollback',
        'super_admin_user_id',
        'primary_currency',
        'secret_key',
        'logo',
        'created_at',
        'modified_at',
        'trader_id',
        'trader_preference'
    ];

    public function sportsBetSetting() {
        return $this->hasOne(SportsBetSetting::class);
    }

    public function crashGameSetting() {
      return $this->hasOne(CrashGameSettings::class,'id');
  }

  public function configuration() {
    return $this->hasOne(TenantConfigurations::class,'id');
}

    public function admins()
    {
        $role_id = SubscriberAdminRole::where("name", "Admin")->first()->id;
        return $this->hasMany(SubscriberAdmin::class, 'subscriber_id')->whereHas('role', function ($role) use ($role_id) {
            $role->where('admin_role_id', $role_id);
        });
    }
    public function users()
    {
        return $this->hasMany(User::class,'subscriber_id','id');
    }
    protected static function boot()
  {
      parent::boot();
      self::deleting(function ($subscribers) {
        $subscribers->users()->each(function($user) {
          $user->delete(); // <-- direct deletion
       });

       $subscribers->sportsBetSetting()->each(function($setting) {
        $setting->delete(); // <-- direct deletion
     });

     $subscribers->configuration()->each(function($configuration) {
        $configuration->delete(); // <-- direct deletion
     });

     $subscribers->crashGameSetting()->each(function($crashGameSetting) {
        $crashGameSetting->delete(); // <-- direct deletion
     });

     $subscribers->admins()->each(function($admin) {
        $admin->delete(); // <-- direct deletion
     });

    });
  }
}
