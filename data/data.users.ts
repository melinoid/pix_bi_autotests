import Helper from '../utils/helper';
import { User } from './data';

/** Всё связанное с тестовыми данными пользователей. */
export default class UsersTD {
  /**
   * Генерация пользователя.
   * @returns объект с данными пользователя.
   */
  static async createUser() {
    let user = <User>{};
    const userUid = Helper.genUid();

    user.username = 'test_' + userUid;
    user.password = '9urT@2vUV' + userUid;
    user.first_login_reset_password = false;
    user.displayed_name = 'User ' + userUid;
    user.email = `test_${userUid}@test.ru`;
    user.active = true;
    user.ad_imported = false;

    return user;
  }
}
