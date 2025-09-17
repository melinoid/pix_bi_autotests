import Helper from '../utils/helper';
import { Groups } from './data';

/** Всё связанное с тестовыми данными групп. */
export default class GroupsTD {
  /**
   * Генерация Группы.
   * @returns объект с данными группы.
   */
  static async createGroup() {
    let group = <Groups>{};
    const groupUid = Helper.genUid();

    group.name = 'test_group_' + groupUid;
    group.description = 'Test Group ' + groupUid;

    return group;
  }
}
