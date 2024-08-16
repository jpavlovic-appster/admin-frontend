<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;
use App;
use App\Models\Tenants;
use App\Models\TenantThemeSettings;
use App\Models\Themes;

class MailController extends Controller {

    // Affiliate
    public function newAffiliate($affiliate) {

        $app = App::getInstance();
        $app->register('App\Providers\MailServiceProvider');

        $data['username'] = $affiliate->username;
        $data['email'] = $affiliate->email;
        $data['password'] = $affiliate->newpassword;
        $data['banner'] = $affiliate->banner;
        $data['link'] = env("APP_URL_FRONT") . "affiliate/login";

        Mail::send('emails.affiliate.new_affiliate', $data, function($message) use ( $affiliate ) {
            $message->to($affiliate->email);
            $message->subject('Welcome and thanks for Joining us');
        });

    }

    public function affiliateChangePassword($affiliate) {
        
        $app = App::getInstance();
        $app->register('App\Providers\MailServiceProvider');

        $data['username'] = $affiliate->username;
        $data['password'] = $affiliate->newpassword;
        $data['link'] = env("APP_URL_FRONT") . "affiliate/login";

        Mail::send('emails.affiliate.change_password', $data, function($message) use ( $affiliate ) {
            $message->to($affiliate->email);
            $message->subject('Your Password has been Changed');
        });

    }

    public function affiliateChangeBanner($affiliate) {
        
        $app = App::getInstance();
        $app->register('App\Providers\MailServiceProvider');

        $data['username'] = $affiliate->username;
        $data['banner'] = $affiliate->banner;
        $data['link'] = env("APP_URL_FRONT") . "affiliate/login";

        Mail::send('emails.affiliate.change_banner', $data, function($message) use ( $affiliate ) {
            $message->to($affiliate->email);
            $message->subject('Your Banner has been Changed');
        });

    }

    // Admin
    public function newAdminParent($admin) {
        
        $app = App::getInstance();
        $app->register('App\Providers\MailServiceProvider');

        Mail::send('emails.admin.new_admin_parent', $admin, function($message) use ( $admin ) {
            $message->to($admin['email']);
            $message->subject('A new ('.$admin['role'].' '.$admin['downusername'].') has been added under you');
        });
    }

    public function newAdmin($admin) {
        
        $app = App::getInstance();
        $app->register('App\Providers\MailServiceProvider');

        $data['username'] = $admin->first_name.' '.$admin->last_name;
        $data['email'] = $admin->email;
        $data['password'] = $admin->newpassword;
        $data['link'] = env("APP_URL_FRONT") . "login";
        
        Mail::send('emails.admin.new_admin', $data, function($message) use ( $admin ) {
            $message->to($admin->email);
            $message->subject('Welcome and thanks for Joining us');
        });

    }

    public function adminChangePassword($admin) {
        
        $app = App::getInstance();
        $app->register('App\Providers\MailServiceProvider');

        $data['username'] = $admin->first_name.' '.$admin->last_name;
        $data['password'] = $admin->newpassword;
        $data['link'] = env("APP_URL_FRONT") . "login";

        Mail::send('emails.admin.change_password', $data, function($message) use ( $admin ) {
            $message->to($admin->email);
            $message->subject('Your Password has been Changed');
        });

    }

    // User 
    public function newUser($user) {
        
        $app = App::getInstance();
        $app->register('App\Providers\MailServiceProvider');

        $data['username'] = $user->first_name.' '.$user->last_name;
        $data['email'] = $user->email;
        $data['password'] = $user->newpassword;
        $data['link'] = env("APP_URL_USER");

        Mail::send('emails.user.new_user', $data, function($message) use ( $user ) {
            $message->to($user->email);
            $message->subject('Welcome and thanks for Joining us');
        });

    }

    public function userChangePassword($user) {
        
        $app = App::getInstance();
        $app->register('App\Providers\MailServiceProvider');

        $data['username'] = $user->first_name.' '.$user->last_name;
        $data['password'] = $user->newpassword;
        $data['link'] = env("APP_URL_USER");

        Mail::send('emails.user.change_password', $data, function($message) use ( $user ) {
            $message->to($user->email);
            $message->subject('Your Password has been Changed');
        });

    }

    // public function userLoyalBonus($user, $bonus, $currency) {
        
    //     $app = App::getInstance();
    //     $app->register('App\Providers\MailServiceProvider');

    //     $data['username'] = $user->first_name.' '.$user->last_name;
    //     $data['currency'] = $currency;
    //     $data['bonus'] = $bonus;

    //     Mail::send('emails.user.loyal_bonus', $data, function($message) use ( $user ) {
    //         $message->to($user->email);
    //         $message->subject('Congratulation you have recieved Loyal Bonus');
    //     });

    // }


    // Subscriber
    public function newSubscriberAdmin($admin) {

        $app = App::getInstance();
        $app->register('App\Providers\MailServiceProvider');

        $data['username'] = $admin->first_name.' '.$admin->last_name;
        $data['email'] = $admin->email;
        $data['password'] = $admin->newpassword;
        $data['link'] = env("APP_URL_FRONT") . "subscriber/login";

        Mail::send('emails.subscriber.new_admin', $data, function($message) use ( $admin ) {
            $message->to($admin->email);
            $message->subject('Welcome and thanks for Joining us');
        });

    }

    public function subscriberAdminChangePassword($admin) {
        
        $app = App::getInstance();
        $app->register('App\Providers\MailServiceProvider');

        $data['username'] = $admin->first_name.' '.$admin->last_name;
        $data['password'] = $admin->newpassword;
        $data['link'] = env("APP_URL_FRONT") . "subscriber/login";

        Mail::send('emails.subscriber.change_password', $data, function($message) use ( $admin ) {
            $message->to($admin->email);
            $message->subject('Your Password has been Changed');
        });

    }



}
