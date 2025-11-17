import { APIResponse } from '@playwright/test';
import test from '@playwright/test';

let response: APIResponse;
const path = '/api/v0/email-reports/list';

test(`Проверка POST ${path}`, async ({ request }) => {
  await test.step('200', async () => {
    response = await request.post(path, {
      headers: { authorization: process.env.BI_TOKEN || '' },
      data: {
        pageNumber: 1,
        pageSize: 100,
        searchText: '',
        sort: [],
        filters: {},
      },
    });

    const status = response.status();
    if (status !== 200) {
      throw Error('Ожидаемый статус: 200. Полученный статус запроса: ' + status);
    }
  });

  await test.step('200 с невалидным заголовком', async () => {
    response = await request.post(path, {
      headers: { authorization: process.env.BI_TOKEN || '', broken: '123' },
      data: {
        pageNumber: 1,
        pageSize: 100,
        searchText: '',
        sort: [],
        filters: {},
      },
    });

    const status = response.status();
    if (status !== 200) {
      throw Error('Ожидаемый статус: 200. Полученный статус запроса: ' + status);
    }
  });

  await test.step('200 с лишним параметром', async () => {
    response = await request.post(path, {
      headers: { authorization: process.env.BI_TOKEN || '' },
      data: {
        pageNumber: 1,
        pageSize: 100,
        searchText: '',
        sort: [],
        filters: {},
        broken: '123',
      },
    });

    const status = response.status();
    if (status !== 200) {
      throw Error('Ожидаемый статус: 401. Полученный статус запроса: ' + status);
    }
  });

  await test.step('401', async () => {
    response = await request.post(path, {});

    const status = response.status();
    if (status !== 401) {
      throw Error('Ожидаемый статус: 401. Полученный статус запроса: ' + status);
    }
  });
});
