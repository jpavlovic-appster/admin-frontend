import { Currency } from ".";

export interface Subscriber {
    id: number;
    subscriber_name: string;
    language: string;
    organization_id: number;
    status: number;
    domain: string;
    logo: string;
    primary_currency: string;
    public_key: string;
    auth: string;
    credit: string;
    debit: string;
    rollback: string;
    get_balance: string;
    trader_id: number;
    trader_preference: string;
    secret_key: string;
    // percentage: number;
    // start_date: string;
    // end_date: string;
    configurations: Currency[];
    created_at: string;
    modified_at: string;
    count: number;
    profit:any;
    theme: any;
    users_count:number;
    org:any;
}
