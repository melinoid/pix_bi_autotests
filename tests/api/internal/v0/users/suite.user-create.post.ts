import { APIResponse } from '@playwright/test';
import test from '@playwright/test';

let response: APIResponse;
const path = '/api/v0/user-create';

test(`Проверка POST ${path}`, async ({ request }) => {
  await test.step('401', async () => {
    response = await request.post(path, {
      data: {
        name: 'string',
        displayName: 'string',
        email: 'string',
        password: 'string',
        password_confirm: 'string',
        groups: [0],
        forceChangeOnLogin: true,
        userLicenseId: 0,
        useActiveDirectoryAuthentication: true,
        activeDirectoryUserSid: 'string',
        activeDirectoryUserName: 'string',
        inactive: true,
      },
    });

    const status = response.status();
    if (status !== 401) {
      throw Error('Ожидаемый статус: 401. Полученный статус запроса: ' + status);
    }
  });
});
