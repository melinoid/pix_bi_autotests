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
    ldapConnector.protocol_version = 'LDAP V3';
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
  /**
   * Генерация фейковых настроек LDAP коннектора.
   * @returns объект с данными коннектора.
   */
  static async createFakeLDAPConnector() {
    let ldapConnector = <LDAP>{};
    const ldapConnectorUid = Helper.genUid();

    ldapConnector.name = 'fake_test_ldap_connector_' + ldapConnectorUid;
    ldapConnector.description = 'Fake Test LDAP Connector ' + ldapConnectorUid;
    ldapConnector.enabled = false;
    ldapConnector.lazy_import = Math.random() > 0.5;
    ldapConnector.active_directory = Math.random() > 0.5;
    ldapConnector.server = ldapConnectorUid;
    ldapConnector.port = Helper.genNum(1000) + '';
    ldapConnector.connection_type = 'Simple';
    ldapConnector.ad_user = ldapConnectorUid;
    ldapConnector.ad_password = ldapConnectorUid;
    ldapConnector.domain = ldapConnectorUid;
    ldapConnector.ssl = false;
    ldapConnector.tls = false;
    ldapConnector.search_base = ldapConnectorUid;
    ldapConnector.ad_query = ldapConnectorUid;
    ldapConnector.sync_groups = ldapConnectorUid;
    ldapConnector.protocol_version = Math.random() > 0.5 ? 'LDAP V3' : 'LDAP V2';
    ldapConnector.timeout = Helper.genNum(1000) + '';
    ldapConnector.periodic_update = {
      enabled: true,
      timezone: 'Asia/Yakutsk',
      cron: '1 0 * * *',
    };
    ldapConnector.attributes_mapping = {
      display_name: ldapConnectorUid,
      email: ldapConnectorUid,
      account_name: ldapConnectorUid,
      object_sid: ldapConnectorUid,
      group_membership: ldapConnectorUid,
      object_class: ldapConnectorUid,
      user_object_class: ldapConnectorUid,
      group_object_class: ldapConnectorUid,
    };

    return ldapConnector;
  }
}
