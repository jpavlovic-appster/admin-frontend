<?php

namespace App\Imports;

use App\Models\OnlineGameSystem\FreeBets;
use Maatwebsite\Excel\Concerns\ToModel;
// use Maatwebsite\Excel\Concerns\WithHeadingRow;
use Maatwebsite\Excel\Concerns\WithValidation;
use Maatwebsite\Excel\Concerns\WithStartRow;
use App\Models\SubscriberSystem\User as SubscriberUser;
use Illuminate\Support\Facades\Auth;

use Carbon\Carbon;

class FreeBetImport implements ToModel , WithStartRow, WithValidation
{
    /**
    * @param array $row
    *
    * @return \Illuminate\Database\Eloquent\Model|null
    */
    public function model(array $row)
    {
      $s_user = Auth::user();
        return new FreeBets([
            //
            'user_id'     => $row[0],
            'currency_code'    => $row[1],
            'bet_amount'  => $row[2],
            'num_of_free_bets'    => $row[3],
            'end_date'  => \PhpOffice\PhpSpreadsheet\Shared\Date::excelToDateTimeObject($row[4])->format('Y-m-d'),
            'subscriber_id' => $s_user->subscriber_id
        ]);

    }
    public function rules(): array
    {

    return [
        0            => 'required|unique:online_game_system.free_bets,user_id',
        1            => 'required',
        2            => 'required',
        3            => 'required',
        4            => 'required',
          // Can also use callback validation rules for team id
          '0' => function ($attribute, $value, $onFailure) {
            $s_user = Auth::user();
            $user = SubscriberUser::where('subscriber_id', $s_user->subscriber_id)
            ->where('id', $value)->first();
            if (!$user) {
                $onFailure('No such user exists');
            }

            $freebet = FreeBets::where('user_id', $value)->first();
            // if ($freebet) {
            //     $onFailure('User id' . $value . ' already allotted free bets');
            // }

        },



    ];
}
public function startRow(): int
    {
        return 2;
    }
}
