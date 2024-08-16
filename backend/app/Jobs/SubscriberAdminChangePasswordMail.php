<?php

namespace App\Jobs;

use Illuminate\Bus\Queueable;

use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;

use Illuminate\Support\Facades\Mail;
use App;

class SubscriberAdminChangePasswordMail implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;
    public $admin;

    /**
     * Create a new job instance.
     *
     * @return void
     */
    public function __construct($admin)
    {
        $this->admin = $admin;
    }

    /**
     * Execute the job.
     *
     * @return void
     */
    public function handle()
    {

        $app = App::getInstance();
        $app->register('App\Providers\MailServiceProvider');

        $data['username'] = $this->admin->first_name.' '.$this->admin->last_name;
        $data['password'] = $this->admin->newpassword;
        $data['link'] =  env("APP_URL_FRONT_SUB")."/subscriber/login";

        Mail::send('emails.subscriber.change_password', $data, function($message) {
            $message->to($this->admin->email);
            $message->subject('Your Password has been Changed');
        });
    }
}
