import Helper from '../utils/helper';
import { LicenseRule } from './data';

/** Всё связанное с тестовыми данными правил распределения лицензий. */
export default class LicenseRulesTD {
  /**
   * Генерация данных правила распределения лицензий.
   * @returns объект с данными правила.
   */
  static async createRule() {
    let licenseRule = <LicenseRule>{};
    const licenseRuleUid = Helper.genUid();

    licenseRule.name = 'test_license_rule_' + licenseRuleUid;
    licenseRule.description = 'Test License Rule ' + licenseRuleUid;
    licenseRule.enabled = Math.random() > 0.5;
    licenseRule.new_user_apply = Math.random() > 0.5;
    licenseRule.license_type = ['Pro', 'Base'][+(Math.random() > 0.5)] as 'Pro' | 'Base';
    licenseRule.user_filter = [['UserName', 'in', 'admin']];

    return licenseRule;
  }
}
