import Helper from '../utils/helper';
import { AdminRule } from './data';

/** Всё связанное с тестовыми данными правил администрирования. */
export default class AdminRuleTD {
  /**
   * Генерация данных правила администрирования.
   * @returns объект с данными правила.
   */
  static async createAdminRule() {
    let adminRule = <AdminRule>{};
    const adminRuleUid = Helper.genUid();

    adminRule.name = 'admin_rule_' + adminRuleUid;
    adminRule.description = 'Admin Rule ' + adminRuleUid;

    return adminRule;
  }
}
