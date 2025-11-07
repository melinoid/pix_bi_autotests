import { test as setup } from '../../../utils/fixtures';
import { writeData } from '../../../data/data.common';
import UsersTD from '../../../data/data.users';
import GroupsTD from '../../../data/data.groups';
import LicenseRulesTD from '../../../data/data.licenseRules';
import LDAPConnectorsTD from '../../../data/data.ldapConnector';
import DirectoriesTD from '../../../data/data.directory';

setup('Генирируем тестовые данные', async () => {
  // Сущности со случайными атрибутами для смоков
  writeData('user_uno', await UsersTD.createUser());
  writeData('group_uno', await GroupsTD.createGroup());
  writeData('license_rule_uno', await LicenseRulesTD.createRule());
  writeData('ldap_connector_uno', await LDAPConnectorsTD.createLDAPConnector());
  writeData('directory_uno', await DirectoriesTD.createDirectory());
});
