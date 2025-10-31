import Helper from '../utils/helper';
import { LicenseRule } from './data';

/** Всё связанное с тестовыми данными правил распределения лицензий. */
export default class LicenseRulesTD {
  /**
   * Генерация правила распределения лицензий.
   * @returns объект с данными правила.
   */
  static async createRule() {
    let licenseRule = <LicenseRule>{};
    const licenseRuleUid = Helper.genUid();

    licenseRule.name = 'test_license_rule_' + licenseRuleUid;
    licenseRule.description = 'Test License Rule ' + licenseRuleUid;
    licenseRule.enabled = true;
    licenseRule.new_user_apply = true;
    licenseRule.license_type = 'Pro';
    licenseRule.user_filter = [['UserName', 'in', 'admin']]

    return licenseRule;
  }
}
