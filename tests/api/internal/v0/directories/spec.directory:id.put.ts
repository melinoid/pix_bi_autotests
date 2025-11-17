import { APIResponse } from '@playwright/test';
import test from '@playwright/test';

let response: APIResponse;

const directoryId = 1;
const path = `/api/v0/directory/${directoryId}`;

test(`Проверка PUT ${path}`, async ({ request }) => {
  await test.step('401', async () => {
    response = await request.put(path, {});

    const status = response.status();
    if (status !== 401) {
      throw Error('Ожидаемый статус: 401. Полученный статус запроса: ' + status);
    }
  });
});
