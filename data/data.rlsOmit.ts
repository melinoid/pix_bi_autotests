import Helper from '../utils/helper';
import { RlsOmit } from './data';

/** Всё связанное с тестовыми данными ограничений RLS/OMIT. */
export default class RlsOmitsTD {
  /**
   * Генерация ограничения.
   * @returns объект с данными ограничения.
   */
  static async createRestriction() {
    let rlsOmit = <RlsOmit>{};
    const rlsOmitUid = Helper.genUid();

    rlsOmit.name = 'rls_omit_' + rlsOmitUid;
    rlsOmit.description = 'RLS/OMIT Restriction ' + rlsOmitUid;
    rlsOmit.enabled = Math.random() > 0.5;
    rlsOmit.appName = 'Smoke_app';
    rlsOmit.user_filter = [['UserName', 'in', 'admin']];
    rlsOmit.rls_filter = [['Number', 'in', '123']];
    rlsOmit.omit_filter = [['in', '321']];

    return rlsOmit;
  }
}
