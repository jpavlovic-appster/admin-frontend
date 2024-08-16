<?php

namespace App\Jobs;

use Illuminate\Bus\Queueable;

use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;

use Illuminate\Support\Facades\Mail;
use App;

class UserChangePasswordMail implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;
    public $user;
    
    /**
     * Create a new job instance.
     *
     * @return void
     */
    public function __construct($user)
    {
        $this->user = $user;
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

        $data['username'] = $this->user->first_name.' '.$this->user->last_name;
        $data['password'] = $this->user->newpassword;
        $data['link'] = env("APP_URL_USER");

        Mail::send('emails.user.change_password', $data, function($message) {
            $message->to($this->user->email);
            $message->subject('Your Password has been Changed');
        });
    }
}
