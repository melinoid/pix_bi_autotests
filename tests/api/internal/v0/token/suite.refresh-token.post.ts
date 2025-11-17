import { APIResponse } from '@playwright/test';
import test from '@playwright/test';

let response: APIResponse;
const path = '/api/v0/refresh-token';

test(`Проверка GET ${path}`, async ({ request }) => {
  await test.step('405', async () => {
    response = await request.get(path, {});

    const status = response.status();
    if (status !== 405) {
      throw Error('Ожидаемый статус: 405. Полученный статус запроса: ' + status);
    }
  });
});
