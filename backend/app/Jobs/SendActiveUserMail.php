<?php

namespace App\Jobs;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldBeUnique;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;

# Models
use App\Models\CrmTemplate;
use App\Models\User;

# Mailables
use App\Mail\Crm;

# Helpers and Libraries
use DB;
use Mail;
use App;

class SendActiveUserMail implements ShouldQueue
{
  use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

  public $template_id;

  /**
   * Create a new job instance.
   *
   * @return void
   */
  public function __construct($templateId)
  {
    $this->template_id = $templateId;
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

    $template = CrmTemplate::where('id', $this->template_id)
    ->first();

    $users = User::where('active', true)
    ->where('created_at', '>=', '2021-09-10')
    ->where('tenant_id', $template->admin->tenant_id);

    $users->chunk(100, function($users) use ($template){

      foreach($users as $user){

        $template->content = str_replace('#{username}', $user->user_name, $template->content);
        $template->content = str_replace('#{first_name}', $user->first_name, $template->content);
        $template->content = str_replace('#{last_name}', $user->last_name, $template->content);

        Mail::to($user->email)->send(new Crm($template));

      }

    });
  }
}
