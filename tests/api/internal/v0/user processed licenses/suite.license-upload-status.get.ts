import { APIResponse } from '@playwright/test';
import test from '@playwright/test';

let response: APIResponse;
const path = '/api/v0/license-upload-status';

test(`Проверка GET ${path}`, async ({ request }) => {
  await test.step('200', async () => {
    response = await request.get(path, {});

    const status = response.status();
    if (status !== 200) {
      throw Error('Ожидаемый статус: 200. Полученный статус запроса: ' + status);
    }
  });
});
