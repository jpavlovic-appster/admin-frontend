<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\Artisan;

class MigrateSchema extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'migrate:schema {schemaName?}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Can migrate specified schemas and all schemas including public will be migrated if schema not specified';

    /**
     * Create a new command instance.
     *
     * @return void
     */
    public function __construct()
    {
        parent::__construct();
    }

    /**
     * Execute the console command.
     *
     * @return int
     */
    public function handle()
    {
        if ($this->argument('schemaName') != NULL) {
            $param = explode(',', $this->argument('schemaName'));
            
            if (in_array('online_game_system', $param)) {
                Artisan::call(
                    'migrate',
                    array(
                        '--path' => 'database/migrations/online_game_system'
                    )
                );
            }
        } else {
            
            Artisan::call('migrate');
            Artisan::call(
                'migrate',
                array(
                    '--path' => 'database/migrations/online_game_system'
                )
            );
        }
        echo 'Success';
        return 0;
    }
}
