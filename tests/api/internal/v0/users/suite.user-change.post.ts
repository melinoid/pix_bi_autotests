import { APIResponse } from '@playwright/test';
import test from '@playwright/test';

let response: APIResponse;
const path = '/api/v0/user-change';

test(`Проверка POST ${path}`, async ({ request }) => {
  await test.step('401', async () => {
    response = await request.post(path, {
      data: {
        id: 'string',
        password: 'string',
        password_confirm: 'string',
        current_password: 'string',
        forceChangeOnLogin: true,
      },
    });

    const status = response.status();
    if (status !== 401) {
      throw Error('Ожидаемый статус: 401. Полученный статус запроса: ' + status);
    }
  });
});
