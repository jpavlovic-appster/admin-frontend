export interface User {
    name: string;
    first_name: string;
    email: string;
    token: string;
    is_verified: boolean;
    active: boolean;
    status: number;
    amount: string;
    currency_id: number;
    nick_name: string;
    user_name: string;
    currency_code: string;
    wallet_id: number;
    wallet_updated_at: string;
    non_cash_amount: string;
    email_verified: boolean;
    nocash_bonus_last_amount: number;
    wallets:null;
    created_at: string;
    id: number;
    last_name: string;
    parent_id: number;
    parent_type: string;
    remember_created_at: string;
    reset_password_sent_at: string;
    reset_password_token: string;
    updated_at: string;
    demo: boolean;
    is_retail_user: boolean;
    user_code:string;
    user_bets_count:number;
    online_status: any;
    last_bet: any;
    last_active: any;
    free_bet: any;
    bonus: any;
    country_code: string;
    date_of_birth: string;
    deleted_at: string;
    last_deposited_amount: string;
    phone: string;
    sign_in_count: number;
    tenant_id: number;
    vip_level: number;

    disabled_at: null
    disabled_by_type: null
    gender: null
    last_login_date: null
    locale: null
    phone_code: null
    self_exclusion: null
    setting: any;
    sign_in_ip: null
    user_documents: any;
}
