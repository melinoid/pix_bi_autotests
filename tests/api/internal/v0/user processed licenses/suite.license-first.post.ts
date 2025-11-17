import { APIResponse } from '@playwright/test';
import test from '@playwright/test';

let response: APIResponse;
const path = '/api/v0/license-first';

test(`Проверка POST ${path}`, async ({ request }) => {
  await test.step('400', async () => {
    response = await request.post(path, {});

    const status = response.status();
    if (status !== 400) {
      throw Error('Ожидаемый статус: 400. Полученный статус запроса: ' + status);
    }
  });
});
