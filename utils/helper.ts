import { v4 as uuidv4 } from 'uuid';

export default class Helper {
  readonly regexMasks = {
    guid: /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/,
    ipv4: /^(([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])\.){3}([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])(\/(3[0-2]|[1-2]?\d))?$/,
  };

  /**
   * Генерация случайного целого числа.
   * @param first граница множества `± one -> 0`.
   * @param second (опционально) граница множества `± one -> ± two`.
   * @returns число.
   */
  static genNum(first: number, second?: number) {
    if (!second) {
      return Math.floor(Math.random() * (first + 1));
    } else {
      return Math.ceil(Math.random() * (second - first) + first);
    }
  }

  /**
   * Генерация UID.
   * @returns строка в 6 символов.
   */
  static genUid() {
    return uuidv4().slice(0, 6);
  }

  /**
   * Поднять регистр первой буквы слов.
   * @param str строка.
   * @returns строка.
   */
  static toUpperCaseFirst(str: string) {
    return str.replace(/( |^)[а-яёa-z]/g, function (x) {
      return x.toUpperCase();
    });
  }
}
