<?php

namespace App\Services;

use Illuminate\Support\Facades\Auth;
use App\Models\Transactions;
use Illuminate\Support\Facades\Response;

class TransactionsService
{

    public static function noCashTransactionHistory($wallet_id, $non_cash_amount, $type)
    {

        $walletDetails = getWalletDetails(@Auth::user()->id, ADMIN_TYPE);
        $bothWallet = Transactions::getWallet($wallet_id, $walletDetails[0]->id);

        if ($bothWallet['sourceWallet']->id == $bothWallet['targetWallet']->id) {
            return returnResponse(false, 'Source wallet and target wallets are same',
                [], Response::HTTP_EXPECTATION_FAILED);
        }
//        $currencySource = Currencies::find($bothWallet['sourceWallet']->currency_id)->first();

//        $targetWallet = Currencies::find($bothWallet['targetWallet']->currency_id)->first();

        /*if($bothWallet['sourceWallet']->amount< $non_cash_amount){
            return returnResponse(false, 'Source wallet amount not grater then target Wallet',
                [] ,Response::HTTP_EXPECTATION_FAILED);
        }*/

        $currencySource = Currencies::where('code', $walletDetails[0]->currency_code)->first();
        $targetWallet = Currencies::where('code', $bothWallet['targetWallet']->currency_code)->first();

        $insertData = [
            'actionee_type' => ADMIN_TYPE,
            'actionee_id' => @Auth::user()->id,
            'source_currency_id' => $currencySource->id,
            'target_currency_id' => $targetWallet->id,
            'source_wallet_id' => $walletDetails[0]->id,
            'target_wallet_id' => $wallet_id,
            'status' => 'success',
            'amount'=>$non_cash_amount,
            'tenant_id' => @Auth::user()->tenant_id,
            'created_at' => @date('Y-m-d h:i:s'),
            'comments' => '',
            'transaction_type' => $type,
            'payment_method' => 'manual'
        ];
        $createdValues = Transactions::create($insertData);
        return $createdValues;
    }
}
