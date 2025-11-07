import { getADConfig } from '../utils/config';
import Helper from '../utils/helper';
import { LDAP } from './data';
import dayjs from 'dayjs';
var timezone = require('dayjs/plugin/timezone');
dayjs.extend(timezone);

/** Всё связанное с тестовыми данными LDAP коннектороров. */
export default class LDAPConnectorsTD {
  /**
   * Генерация настроек LDAP коннектора.
   * @returns объект с данными коннектора.
   */
  static async createLDAPConnector() {
    const ADConfig = getADConfig();
    let ldapConnector = <LDAP>{};
    const ldapConnectorUid = Helper.genUid();

    ldapConnector.name = 'test_ldap_connector_' + ldapConnectorUid;
    ldapConnector.description = 'Test LDAP Connector ' + ldapConnectorUid;
    ldapConnector.enabled = true;
    ldapConnector.lazy_import = false;
    ldapConnector.active_directory = true;
    ldapConnector.server = ADConfig.host ?? '';
    ldapConnector.port = ADConfig.port ?? '';
    ldapConnector.connection_type = 'Simple';
    ldapConnector.ad_user = ADConfig.user ?? '';
    ldapConnector.ad_password = ADConfig.password ?? '';
    ldapConnector.domain = ADConfig.domen;
    ldapConnector.ssl = false;
    ldapConnector.tls = false;
    ldapConnector.search_base = 'OU=GPN,DC=domen,DC=local';
    ldapConnector.ad_query = '(&(objectClass=user)(|(CN=UGPN31)(CN=UGPN32)))';
    ldapConnector.sync_groups = '(&(objectCategory=group)(cn=*))';
    ldapConnector.ldap_protocol_version = 'LDAP V3';
    ldapConnector.timeout = '200';
    ldapConnector.periodic_update = {
      enabled: false,
      timezone: dayjs.tz.guess(),
      cron: '0 0 * * *',
    };
    ldapConnector.attributes_mapping = {
      display_name: 'name',
      email: 'mail',
      account_name: 'sAMAccountName',
      object_sid: 'objectSid',
      group_membership: 'memberof',
      object_class: 'objectclass',
      user_object_class: 'person',
      group_object_class: 'group',
    };

    return ldapConnector;
  }
}
