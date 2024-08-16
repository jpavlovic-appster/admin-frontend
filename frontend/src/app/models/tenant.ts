export interface Tenant {
    id: number;
    name: string;
    active: boolean;
    status: number;
    domain: string;
    public_key: string;
    configurations?: any;
    setting?: any;
    primary_currency: string;
    created_at: string;
    updated_at: string;
}
