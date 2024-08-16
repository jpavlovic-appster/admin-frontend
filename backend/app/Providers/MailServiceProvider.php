<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use App\Models\TenantCredentials;
use Illuminate\Support\Facades\Auth;
use Config;
use App\Models\Tenants;
use App\Models\TenantThemeSettings;

class MailServiceProvider extends ServiceProvider
{
    /**
     * Register services.
     *
     * @return void
     */
    public function register()
    {

        $user = Auth::User();

        $id = '';
        $where = '';

        if (isset($user->subscriber_id)) {
            $where = 'subscriber_id';
            $id = $user->subscriber_id;
        } else if (isset($user->tenant_id)) {
            $where = 'tenant_id';
            $id = $user->tenant_id;
        }

        if (!empty($id) && !empty($where)) {

            $records = TenantCredentials::select(['key', 'value'])->where($where, $id)->whereIn('key', ['APP_SENDGRID_RELAY_KEY', 'APP_SENDGRID_HOST', 'APP_SENDGRID_PORT', 'APP_SENDGRID_USERNAME', 'APP_SENDGRID_EMAIL'])->get();

            $mail = array();
            foreach ($records as $key => $value) {
                $mail[$value['key']] = $value['value'];
            }

            // if (count($mail) === 5) {
            $config = array(
                'driver'     => env('MAIL_DRIVER', 'smtp'),
                'host'       => $mail['APP_SENDGRID_HOST'],
                'port'       => $mail['APP_SENDGRID_PORT'],
                'from'       => array('address' => $mail['APP_SENDGRID_EMAIL'], 'name' => env('MAIL_FROM_NAME', 'BackOffice')),
                'encryption' => env('MAIL_ENCRYPTION', 'tls'),
                'username'   => $mail['APP_SENDGRID_USERNAME'],
                'password'   => $mail['APP_SENDGRID_RELAY_KEY'],
                'tenant_data' => $this->getTenantData($id, $where),
            );

            Config::set('mail', $config);
            // }
        } else {
            Config::set('mail.tenant_data', $this->getTenantData($id, $where));
        }
    }
    public function getTenantData($tenant_id, $where)
    {
        $data = [];
        if (!empty($id) && !empty($where)) {
            $tenant = Tenants::where('id', $tenant_id)->first();
            if ($tenant && $where == 'tenant_id') {
                $data['tenant_name'] = $tenant->name;
            } else {
                $data['tenant_name'] = env("APP_NAME");
            }
            $theme = TenantThemeSettings::where('tenant_id', $tenant_id)->first();
            if ($tenant && $where == 'tenant_id') {
                $data['logo'] = $theme->logo_url;
            } else {
                $data['logo'] = "https://i.ibb.co/kyncfk4/logo.png";
            }
        } else {
            $data['tenant_name'] = env("APP_NAME");
            $data['logo'] = "https://i.ibb.co/kyncfk4/logo.png";
        }

        return $data;
    }

    /**
     * Bootstrap services.
     *
     * @return void
     */
    public function boot()
    {
        //
    }
}
