import { Wallet } from "./wallet";

export interface Admin {
    name: string;
    first_name: string;
    email: string;
    token: string;

    created_at: string;
    id: number;
    last_name: string;
    parent_email: string;
    parent_id: number;
    parent_type: string;
    remember_created_at: string;
    reset_password_sent_at: string;
    reset_password_token: string;
    updated_at: string;
    last_deposited_amount: string;

    agent_name: string;
    phone: number;
    phone_verified: string;
    active: boolean;
    currency_code: number;
    roles: any;

    encrypted_password: string;
    tenant_id: number;
    subscriber_id: number;

    amount: string;
    non_cash_amount: string;
    owner_id: number;
    owner_type: string;
    primary: boolean;
    wallet_id: number;
    wallet_updated_at: string;
    role: any;
    setting: any;
    wallets: any;

    admin_role_id: null
    confirmation_sent_at: null
    confirmation_token: null
    confirmed_at: null
    deactivated_at: null
    deactivated_by_id: null
    deactivated_by_type: null
    unconfirmed_email: null
    tenant: any;
    subscriber: any;
}
