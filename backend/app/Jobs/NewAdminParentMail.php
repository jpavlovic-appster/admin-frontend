<?php

namespace App\Jobs;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Mail;
use App;

class NewAdminParentMail implements ShouldQueue
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

        Mail::send('emails.admin.new_admin_parent', $this->admin, function($message) {
            $message->to($this->admin['email']);
            $message->subject('A new ('.$this->admin['role'].' '.$this->admin['downusername'].') has been added under you');
        });
    }
}
