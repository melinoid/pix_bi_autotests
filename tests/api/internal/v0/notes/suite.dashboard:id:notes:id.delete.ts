import { APIResponse } from '@playwright/test';
import test from '@playwright/test';

let response: APIResponse;

const dashboardId = 1;
const noteId = 1;
const path = `/api/v0/dashboard/${dashboardId}/notes/${noteId}`;

test(`Проверка DELETE ${path}`, async ({ request }) => {
  await test.step('401', async () => {
    response = await request.delete(path, {});

    const status = response.status();
    if (status !== 401) {
      throw Error('Ожидаемый статус: 401. Полученный статус запроса: ' + status);
    }
  });
});
