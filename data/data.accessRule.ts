import Helper from '../utils/helper';
import { AccessRule } from './data';

/** Всё связанное с тестовыми данными правил доступа. */
export default class AccessRuleTD {
  /**
   * Генерация данных правила администрирования.
   * @returns объект с данными правила.
   */
  static async createAccessRule() {
    let accessRule = <AccessRule>{};
    const accessRuleUid = Helper.genUid();

    accessRule.name = 'access_rule_' + accessRuleUid;
    accessRule.description = 'Access Rule ' + accessRuleUid;

    return accessRule;
  }
}
