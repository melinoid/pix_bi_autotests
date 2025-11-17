import { APIResponse } from '@playwright/test';
import test from '@playwright/test';

let response: APIResponse;
const path = '/api/v0/create-token-to-external-resource';

test(`Проверка PUT ${path}`, async ({ request }) => {
  await test.step('500', async () => {
    response = await request.put(path, {
      params: {
        callbackLink: 1,
        memoryKey: 1,
      },
    });

    const status = response.status();
    if (status !== 500) {
      throw Error('Ожидаемый статус: 500. Полученный статус запроса: ' + status);
    }
  });
});
