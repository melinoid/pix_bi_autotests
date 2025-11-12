interface MetaData {
  created_at?: Date | string;
  created_by?: string; // User.username
  modified_at?: Date | string;
  modified_by?: string; // User.username
  deleted_at?: Date | string;
  deleted_by?: string; // User.username
}

export interface LDAP {
  id?: string;
  name: string;
  description?: string;
  enabled: boolean;
  lazy_import: boolean;
  active_directory: boolean;
  server: string;
  port: string;
  connection_type: 'Simple' | 'SASL';
  ad_user: string;
  ad_password: string;
  domain?: string;
  ssl: boolean;
  tls: boolean;
  search_base: string;
  ad_query: string;
  sync_groups?: string;
  ldap_protocol_version: 'LDAP V2' | 'LDAP V3';
  timeout: string;
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
  metadata: MetaData;
}

export interface Group {
  id?: string;
  name: string;
  description?: string;
  type?: 'local' | 'ldap';
  import_source?: string;
  metadata: MetaData;
}

export interface User {
  id?: string;
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
  import_source?: string;
  metadata?: MetaData & {
    last_login_date?: Date;
  };
}

export interface LicenseRule {
  id?: string;
  name: string;
  description?: string;
  enabled: boolean;
  new_user_apply?: boolean;
  license_type: 'Pro' | 'Base';
  user_filter: string[][];
  metadata: MetaData;
}

export interface RlsOmit {
  id?: string;
  name: string;
  description?: string;
  enabled: boolean;
  appName: string;
  user_filter: string[][];
  rls_filter?: string[][];
  omit_filter?: string[][];
  metadata: MetaData;
}

export interface Directory {
  id?: string;
  name: string;
  description?: string;
  metadata: MetaData;
}

export interface Application {
  id?: string;
  name: string;
  description?: string;
  directory_id?: string;
  directory_name?: string;
  metadata: MetaData;
}

export interface AdminRule {
  id?: string;
  name: string;
  description?: string;
  metadata: MetaData;
}

export interface AccessRule {
  id?: string;
  name: string;
  description?: string;
  metadata: MetaData;
}
