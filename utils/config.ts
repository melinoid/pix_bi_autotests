import { User } from '../data/data';

/**
 * Возвращает данные основного пользователя.
 *
 * Содержит имя пользователя и праоль для основной авторизации.
 * @returns объект `User`
 */
export function getMainUser() {
  const user = <User>{
    username: process.env.BI_USERNAME,
    password: process.env.BI_PASSWORD,
    id: process.env.BI_USER_ID,
  };
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
