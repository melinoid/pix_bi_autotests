import Helper from '../utils/helper';
import { Application } from './data';

/** Всё связанное с тестовыми данными приложений. */
export default class ApplicationTD {
  /**
   * Генерация данны приложения.
   * @returns объект с данными приложения.
   */
  static async createApplication() {
    let application = <Application>{};
    const applicationUid = Helper.genUid();

    application.name = 'application_' + applicationUid;
    application.description = 'Application ' + applicationUid;
    application.directory_name = 'Персональная'

    return application;
  }
}
