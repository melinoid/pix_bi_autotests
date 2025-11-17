import { APIResponse } from '@playwright/test';
import test from '@playwright/test';

let response: APIResponse;

const userId = 1;
const path = `/api/v0/admin/users/${userId}/dashboard`;

test(`Проверка POST ${path}`, async ({ request }) => {
  await test.step('401', async () => {
    response = await request.post(path, {});

    const status = response.status();
    if (status !== 401) {
      throw Error('Ожидаемый статус: 401. Полученный статус запроса: ' + status);
    }
  });
});
