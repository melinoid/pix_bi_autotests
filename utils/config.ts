import { User } from '../data/data';
import { data } from '../data/data.common';

/**
 * Возвращает данные основного пользователя.
 * @param wId номер воркера (для main юзеров). При отсутствии возвращает пользователя из глобальных переменных.
 * @returns объект `User`
 */
export function getMainUser(wId?: number) {
  let user = <User>{};
  if (wId !== undefined) {
    user = {
      username: data[`main_user_${wId}`].username,
      password: data[`main_user_${wId}`].password,
      id: data[`main_user_${wId}`].id,
      displayed_name: data[`main_user_${wId}`].displayed_name,
    };
  } else {
    user = {
      username: process.env.BI_USERNAME || '',
      password: process.env.BI_PASSWORD || '',
      id: process.env.BI_USER_ID,
      displayed_name: '',
    };
  }
  if ((user.username || user.email) && user.password && user.id) {
    return user;
  } else {
    throw Error('Check user credentials in autotests environment.');
  }
}

/**
 * Возвращает API токен.
 * @returns строка с токеном.
 */
export function getApiToken() {
  const apiKey = process.env.BI_TOKEN;
  if (apiKey) {
    return apiKey;
  } else {
    throw Error('BI_TOKEN env variable is empty.');
  }
}

/**
 * Возвращает настройки подключения к AD.
 * @returns объект с настройками.
 */
export function getADConfig() {
  const adConfig = {
    user: process.env.AD_USERNAME,
    password: process.env.AD_PASSWORD,
    host: process.env.AD_HOST,
    port: process.env.AD_PORT,
    domen: process.env.AD_DOMEN,
  };
  if (adConfig.user && adConfig.password && adConfig.host && adConfig.port) {
    return adConfig;
  } else {
    throw Error('Check Acive Directory credentials in autotests environment.');
  }
}
