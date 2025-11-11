import { APIResponse } from '@playwright/test';
import { test as setup } from '../../../utils/fixtures';
import { getMainUser } from '../../../utils/config';

let response: APIResponse;

setup('Получаем токен для запросов', async ({ request }) => {
  const mainUser = getMainUser();
  response = await request.post('/api/v0/token', {
    data: { userName: mainUser.username, password: mainUser.password },
  });
  //TODO: обработать !200, прерывая продолжение последующего проекта
  process.env['BI_TOKEN'] = `Bearer ${(await response.json())?.accessToken}`;
});
