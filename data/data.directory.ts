import Helper from '../utils/helper';
import { RlsOmit } from './data';

/** Всё связанное с тестовыми данными директорий. */
export default class DirectoriesTD {
  /**
   * Генерация директории.
   * @returns объект с данными директории.
   */
  static async createDirectory() {
    let directory = <RlsOmit>{};
    const directoryUid = Helper.genUid();

    directory.name = 'directory_' + directoryUid;
    directory.description = 'Directory ' + directoryUid;

    return directory;
  }
}
