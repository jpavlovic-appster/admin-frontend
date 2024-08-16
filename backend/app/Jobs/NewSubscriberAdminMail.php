<?php

namespace App\Jobs;

use Illuminate\Bus\Queueable;

use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;

use Illuminate\Support\Facades\Mail;
use App;

class NewSubscriberAdminMail implements ShouldQueue
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
        $data['email'] = $this->admin->email;
        $data['password'] = $this->admin->newpassword;
        $data['link'] =  "http://ec2-52-28-79-37.eu-central-1.compute.amazonaws.com/subscriber/login";

        Mail::send('emails.subscriber.new_admin', $data, function($message) {
            $message->to($this->admin->email);
            $message->subject('Welcome and thanks for Joining us');
        });
    }
}
