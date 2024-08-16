<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

use App\Models\User;

class ReindexESUsersController extends Controller
{

    public function reIndexUsers($id = null)
    {
        set_time_limit(0);
        $errors = [];
        if (is_null($id)) {
            DB::table('users')->select('id')->orderBy('id')
                ->chunkById(500, function ($users, $errors) {
                    foreach ($users as $user) {
                        try {
                            User::storeElasticSearchData($user->id);
                        } catch (Exception $e) {
                            $errors[] = ['user_id' => $user->id, 'error' => $e->getMessage()];
                        }
                    }
                });
        } else {
            try {
                User::storeElasticSearchData($id);
            } catch (Exception $e) {
                $errors[] = ['user_id' => $id, 'error' => $e->getMessage()];
            }
        }
        echo '<pre>';
        if (empty($errors)) {
            echo 'Process successfully completed';
        } else {
            print_r($errors);
        }

    }
}
