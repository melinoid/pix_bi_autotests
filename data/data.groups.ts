import Helper from '../utils/helper';
import { Group } from './data';

/** Всё связанное с тестовыми данными групп. */
export default class GroupsTD {
  /**
   * Генерация данных группы.
   * @returns объект с данными группы.
   */
  static async createGroup() {
    let group = <Group>{};
    const groupUid = Helper.genUid();

    group.name = 'test_group_' + groupUid;
    group.description = 'Test Group ' + groupUid;

    return group;
  }
}
