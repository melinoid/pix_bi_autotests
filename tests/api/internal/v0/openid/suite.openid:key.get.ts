import { APIResponse } from '@playwright/test';
import test from '@playwright/test';

let response: APIResponse;

const key = 1;
const path = `/openid/${key}`;

test(`Проверка GET ${path}`, async ({ request }) => {
  await test.step('404', async () => {
    response = await request.get(path, {});

    const status = response.status();
    if (status !== 404) {
      throw Error('Ожидаемый статус: 404. Полученный статус запроса: ' + status);
    }
  });
});
