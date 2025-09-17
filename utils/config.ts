import { User } from '../data/data';

/**
 * Function returns an object with User data.
 *
 * Perhaps this is an interim function (returns just `username`, `pass`).
 * Will later be expanded for e2e tests.
 * @returns `User`
 */
export function getMainUser() {
  const user = <User>{
    username: process.env.BI_USERNAME,
    password: process.env.BI_PASSWORD,
  };
  if ((user.username || user.email) && user.password) {
    return user;
  } else {
    throw Error('Check user credentials in autotests environment.');
  }
}

/**
 * Function returns api token for api project from BI_TOKEN env variable.
 * @returns api key.
 */
export function getApiToken() {
  const apiKey = process.env.BI_TOKEN;
  if (apiKey) {
    return apiKey;
  } else {
    throw Error('BI_TOKEN env variable is empty.');
  }
}
