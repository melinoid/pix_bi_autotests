interface MetaData {
  created_at: Date;
  created_by?: string; // User.username
  modified_at?: Date;
  modified_by?: string; // User.username
  deleted_at?: Date;
  deleted_by?: string; // User.username
}

export interface LDAP {
  name: string;
  description?: string;
  enabled: boolean;
  lazy_import: boolean;
  active_directory: boolean;
  server: string;
  port: number;
  connection_type: 'Simple' | 'SASL';
  ad_user: string;
  ad_password: string;
  domain: string;
  ssl: boolean;
  tls: boolean;
  search_base: string;
  ad_query: string;
  sync_groups?: string;
  ldap_protocol_version: 'LDAP V2' | 'LDAP V3';
  timeout: number;
  periodic_update?: {
    enabled: boolean;
    timezone: string;
    cron: string;
  };
  attributes_mapping?: {
    display_name: string;
    email: string;
    account_name: string;
    object_sid: string;
    group_membership: string;
    object_class: string;
    user_object_class: string;
    group_object_class: string;
  };
  metadata?: MetaData;
}

export interface Group {
  name: string;
  description?: string;
  type?: 'local' | 'ldap';
  import_source?: string;
  metadata?: MetaData;
}

export interface User {
  username: string;
  password: string;
  first_login_reset_password?: boolean;
  displayed_name?: string;
  email?: string;
  license_type?: 'Pro' | 'NFR' | 'Base';
  ad_imported?: boolean;
  groups?: Group[];
  ad_groups?: Group[];
  active?: boolean;
  ad_user_id?: string;
  bi_user_id?: string;
  import_source: string;
  metadata?: MetaData & {
    last_login_date: Date;
  };
}

export interface LicenseRule {
  name: string;
  description?: string;
  enabled: boolean;
  new_user_apply?: boolean;
  license_type: 'Pro' | 'Base';
  user_filter: string[][];
  metadata?: MetaData;
}
