import { APIResponse } from '@playwright/test';
import { test as setup } from '../../../../utils/fixtures';

let response: APIResponse;

setup('Получаем токен для запросов', async ({ request }) => {
  response = await request.post('/api/v0/token', {
    data: { userName: process.env.BI_USERNAME, password: process.env.BI_PASSWORD },
  });
  //TODO: обработать !200, прерывая продолжение последующего проекта
  process.env['BI_TOKEN'] = `Bearer ${(await response.json())?.accessToken}`
});
