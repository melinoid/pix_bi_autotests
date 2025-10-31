import { test as setup } from '../../../utils/fixtures';
import { writeData } from '../../../data/data.common';
import UsersTD from '../../../data/data.users';
import GroupsTD from '../../../data/data.groups';
import LicenseRulesTD from '../../../data/data.licenseRules';

setup('Генирируем тестовые данные', async () => {
  writeData('user_uno', await UsersTD.createUser());

  writeData('group_uno', await GroupsTD.createGroup());

  writeData('license_rule_uno', await LicenseRulesTD.createRule());
});
